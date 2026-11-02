import type { Request, Response } from "express";
import mongoose from "mongoose";
// 导入模型
import AIRecord from "@/models/AIRecord";
// 导入工具函数
import { catchAsync, logger, getBeijingTime } from "@/utils";
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
  // 获取userId
  const userId = req.user!.id;
  // 获取请求参数
  const { question, sessionCode, reqId, scene, babyAge, history } = req.body;
  // 构建消息序列
  const messages = buildMessages(question, scene, babyAge, history);
  // 落库为旁路操作：失败仅记日志，不干扰主流程（如 reqId 重复的幂等冲突）
  const saveRecord = (status: 1 | 0, answer: string) =>
    AIRecord.create({
      userId,
      question,
      answer,
      sessionCode,
      reqId,
      status,
    }).catch((err) =>
      logger.error("AI 问答记录落库失败", {
        reqId,
        message: err instanceof Error ? err.message : String(err),
      }),
    );
  try {
    const answer = await deepseekChat(messages);
    saveRecord(1, answer);
    return res.json(ApiResponse.success({ answer }, "success"));
  } catch (err) {
    // 工具层已统一转换并记录上游错误日志，这里取友好提示兜底返回
    const message =
      err instanceof Error ? err.message : "AI 服务繁忙，请稍后再试";
    saveRecord(0, message);
    return res.json(ApiResponse.error(RESPONSE_CODE.SERVER_ERROR, message));
  }
});

/** 流式对话：POST /api/v1/ai/chat/stream，SSE 事件约定：
 * data: {"content":"..."} 增量文本
 * data: {"code":500,"message":"..."} 上游异常通知
 * data: {"done":true} 结束标志 */
export const chatStream = catchAsync(async (req: Request, res: Response) => {
  // 获取userId
  const userId = req.user!.id;
  // 获取请求参数
  const { question, sessionCode, reqId, scene, babyAge, history } = req.body;
  // 构建消息序列
  const messages = buildMessages(question, scene, babyAge, history);

  // 落库为旁路操作：失败仅记日志，不干扰主流程（如 reqId 重复的幂等冲突）
  const saveRecord = (status: 1 | 0, answer: string) =>
    AIRecord.create({
      userId,
      question,
      answer,
      sessionCode,
      reqId,
      status,
    }).catch((err) =>
      logger.error("AI 问答记录落库失败", {
        reqId,
        message: err instanceof Error ? err.message : String(err),
      }),
    );

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

  let answer = "";
  let status: 1 | 0 = 1;
  try {
    for await (const chunk of deepseekChatStream(messages, {
      signal: controller.signal,
    })) {
      if (res.writableEnded || res.destroyed) break;
      answer += chunk;
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

    status = 0;
    // 已生成的部分回答是真实内容，予以保留；仅无内容时记录错误提示
    if (!answer) answer = message;

    if (!res.writableEnded && !res.destroyed && !controller.signal.aborted) {
      send({ code: RESPONSE_CODE.SERVER_ERROR, message });
      send({ done: true });
    }
  } finally {
    // 保留入库
    saveRecord(status, answer);
    req.off("close", handleClose);
    res.end();
  }
});

/** 获取聊天记录，根据日期进行区分，将同一个sessionCode的会话放在一起
 * 响应 data: { list: { [日期]: Array<{ sessionCode, question, chatCount, time }> }, total, page, pageSize }
 */
export const getRecordList = catchAsync(async (req: Request, res: Response) => {
  // 获取userId（aggregate 不会自动 cast，需显式转为 ObjectId）
  const userId = new mongoose.Types.ObjectId(req.user!.id);
  // 获取分页入参（带默认值兜底）
  const { page, pageSize } = req.body;
  // 聚合：按时间正序分组会话，$first 取每个会话第一句作为标题
  const [result] = await AIRecord.aggregate([
    { $match: { userId } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: "$sessionCode",
        question: { $first: "$question" }, // 会话第一条记录的问句
        createdAt: { $first: "$createdAt" }, // 会话开始时间
        chatCount: { $sum: 1 }, // 会话内问答条数
      },
    },
    { $sort: { createdAt: -1 } }, // 会话列表按最近优先
    {
      $facet: {
        total: [{ $count: "count" }],
        sessions: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    },
  ]);
  // 提取总数与当前页会话
  const total = result?.total?.[0]?.count ?? 0;
  const sessions = result?.sessions ?? [];
  // 按北京时间的日期分组（普通对象，保证 JSON 序列化正确）
  const list: Record<
    string,
    Array<{
      sessionCode: string;
      question: string;
      chatCount: number;
      time: string;
    }>
  > = {};
  for (const session of sessions) {
    const time = getBeijingTime(session.createdAt);
    const date = time.split(" ")[0].split("/").join("-");
    if (!list[date]) list[date] = [];
    list[date].push({
      sessionCode: session._id,
      question: session.question,
      chatCount: session.chatCount,
      time,
    });
  }
  return res.json(
    ApiResponse.success({ list, total, page, pageSize }, "success"),
  );
});

/**
 * 获取某个会话的问答明细
 * 入参 sessionCode，按时间正序返回该会话的完整问答
 */
export const getRecordDetail = catchAsync(
  async (req: Request, res: Response) => {
    // 获取userId
    const userId = req.user!.id;
    const { sessionCode } = req.body;
    // 并行查询：当前页问答明细 + 会话总条数
    const records: any = await AIRecord.find(
      { userId, sessionCode },
      { question: 1, answer: 1, status: 1, createdAt: 1 },
    )
      .sort({ createdAt: 1 })
      .lean();
    // 拼接北京时间，便于前端直接展示
    const list = records.map((record: any) => ({
      ...record,
      time: getBeijingTime(record.createdAt as Date),
    }));
    return res.json(ApiResponse.success({ list }, "success"));
  },
);
