import type { Request, Response } from "express";
// 导入工具函数
import { catchAsync, logger } from "@/utils";
import { Response as ApiResponse } from "@/utils";
import {
  chat as deepseekChat,
  chatStream as deepseekChatStream,
} from "@/utils/util/deepseek";
import type { ChatMessage } from "@/types/ai";
// 导入常量
import {
  RESPONSE_CODE,
  MAX_HISTORY,
  BASE_SYSTEM_PROMPT,
  SCENE_PROMPTS,
} from "@/enums";

/** 构建消息序列
 * @param question 用户输入的问题
 * @param scene 场景
 * @param babyAge 宝宝月龄
 * @param history 历史消息序列
 * @returns ChatMessage[]
 */
function buildMessages(
  question: string,
  scene?: string,
  babyAge?: string,
  history?: ChatMessage[],
): ChatMessage[] {
  // 获取系统提示词
  const systemPrompt = (scene && SCENE_PROMPTS[scene]) || BASE_SYSTEM_PROMPT;
  // 消息序列
  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];
  // 只保留最近 MAX_HISTORY 条合法历史，防止上下文超限
  const validHistory = (history ?? [])
    .slice(-MAX_HISTORY)
    .filter(
      (item) =>
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim() !== "",
    );
  messages.push(...validHistory);
  // 宝宝月龄拼进问题，帮助模型给出月龄匹配的建议
  messages.push({
    role: "user",
    content: babyAge ? `【宝宝月龄：${babyAge}】${question}` : question,
  });
  return messages;
}

/** 普通对话：POST /api/v1/ai/chat，响应 data: { answer } */
export const chat = catchAsync(async (req: Request, res: Response) => {
  // 获取请求参数
  const { question, sessionCode, reqId, scene, babyAge, history } = req.body;
  // 构建消息序列
  const messages = buildMessages(question, scene, babyAge, history);
  try {
    const answer = await deepseekChat(messages);
    return res.json(ApiResponse.success({ reqId, answer }, "success"));
  } catch (err) {
    // 工具层已统一转换并记录上游错误日志，这里取友好提示兜底返回
    const message =
      err instanceof Error ? err.message : "AI 服务繁忙，请稍后再试";
    return res.json(ApiResponse.error(RESPONSE_CODE.SERVER_ERROR, message));
  }
});

/** 流式对话：POST /api/v1/ai/chat/stream，SSE 事件约定：
 * data: {"content":"..."} 增量文本
 * data: {"code":500,"message":"..."} 上游异常通知
 * data: {"done":true} 结束标志 */
export const chatStream = catchAsync(async (req: Request, res: Response) => {
  const { question, scene, babyAge, history } = req.body;
  const messages = buildMessages(question, scene, babyAge, history);

  // SSE 响应头：禁用各级缓冲，保证逐段下发（X-Accel-Buffering 供 Nginx 识别）
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no",
  });
  res.flushHeaders();

  // 客户端断开时联动中止上游请求，避免浪费 token
  const controller = new AbortController();
  const handleClose = () => controller.abort();
  req.on("close", handleClose);

  const send = (payload: Record<string, unknown>) => {
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  };

  try {
    for await (const chunk of deepseekChatStream(messages, {
      signal: controller.signal,
    })) {
      if (res.writableEnded || res.destroyed) break;
      send({ content: chunk });
    }
    if (!res.writableEnded && !res.destroyed) {
      send({ done: true });
    }
  } catch (err) {
    // 响应头已发出，HTTP 状态无法变更，改为 SSE 事件通知前端
    const message =
      err instanceof Error ? err.message : "AI 服务繁忙，请稍后再试";
    logger.error("AI 流式对话失败", { message });
    if (!res.writableEnded && !res.destroyed && !controller.signal.aborted) {
      send({ code: RESPONSE_CODE.SERVER_ERROR, message });
      send({ done: true });
    }
  } finally {
    req.off("close", handleClose);
    res.end();
  }
});
