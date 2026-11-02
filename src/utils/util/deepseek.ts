// DeepSeek 大模型客户端封装（OpenAI 兼容协议）
// 使用 Node 22 原生 fetch 实现，无需额外依赖
// 文档：https://api-docs.deepseek.com
import config from "@/config";
import { logger, ApiError } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";
// 导入类型
import type {
  ChatMessage,
  ChatOptions,
  ChatCompletionChunk,
  ChatCompletionResponse,
} from "@/types/ai";

// 转出对话类型（供 @/utils 统一导出）
export type { ChatMessage, ChatOptions };

/**
 * 构建 Chat Completions 请求地址（去除末尾斜杠，兼容带 /v1 的写法）
 * @returns URL
 */
function getChatCompletionsUrl() {
  const base = config.deepseek.baseUrl.replace(/\/+$/, "");
  return `${base}/chat/completions`;
}

/** 发起 Chat Completions 请求，统一处理鉴权、错误码与异常转换
 * @param messages 消息序列
 * @param stream 是否流式对话
 * @param signal 外部中止信号
 * @param options 选项
 * @returns Response
 */
async function doRequest(
  messages: ChatMessage[],
  stream: boolean,
  signal: AbortSignal,
  options: ChatOptions = {},
): Promise<Response> {
  // 获取模型请求配置参数：APIKey、模型、温度
  const { apiKey, model, temperature } = config.deepseek;
  // 未配置密钥时快速失败，避免泄露内部细节
  if (!apiKey) {
    logger.error(
      "DeepSeek API Key 未配置（请在 .env 中设置 DEEPSEEK_API_KEY）",
    );
    throw new ApiError("AI 服务暂不可用", RESPONSE_CODE.SERVER_ERROR);
  }
  try {
    const response = await fetch(getChatCompletionsUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        stream,
        temperature: options.temperature ?? temperature,
        max_tokens: options.maxTokens,
      }),
      signal,
    });
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      logger.error("DeepSeek 请求失败", {
        status: response.status,
        body: text.slice(0, 500),
      });
      throw new ApiError("AI 服务繁忙，请稍后再试", RESPONSE_CODE.SERVER_ERROR);
    }
    return response;
  } catch (err) {
    // ApiError 直接透传，其余异常（网络错误/中止）统一转换
    if (err instanceof ApiError) throw err;
    if (signal.aborted) {
      throw new ApiError(
        "AI 服务响应超时，请稍后再试",
        RESPONSE_CODE.SERVER_ERROR,
      );
    }
    logger.error("DeepSeek 网络请求异常", { message: (err as Error)?.message });
    throw new ApiError("AI 服务繁忙，请稍后再试", RESPONSE_CODE.SERVER_ERROR);
  }
}

/** 解析 SSE 字节流，逐段产出增量文本（data: [DONE] 时结束） */
async function* parseSSEStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE 以换行分隔事件，末段可能不完整，留在缓冲区等待下一帧拼接
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const chunk = JSON.parse(payload) as ChatCompletionChunk;
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) yield delta;
        } catch {
          // 忽略无法解析的片段
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/** 外部中止信号联动：外部已中止则立即中止目标 controller */
function linkAbortSignal(
  source: AbortSignal | undefined,
  target: AbortController,
) {
  if (!source) return;
  if (source.aborted) {
    target.abort();
    return;
  }
  source.addEventListener("abort", () => target.abort(), { once: true });
}

/**
 * 非流式对话：返回完整回答文本
 * @param messages 消息序列
 * @param options 选项
 * @returns string
 */
export async function chat(
  messages: ChatMessage[],
  options: ChatOptions = {},
): Promise<string> {
  const controller = new AbortController();
  linkAbortSignal(options.signal, controller);
  // 超时联动：外部已中止则立即中止目标 controller
  const timer = setTimeout(
    () => controller.abort(),
    options.timeout ?? config.deepseek.timeout,
  );
  try {
    const response = await doRequest(
      messages,
      false,
      controller.signal,
      options,
    );
    const data = (await response.json()) as ChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string") {
      logger.error("DeepSeek 响应格式异常", { data });
      throw new ApiError("AI 响应格式异常", RESPONSE_CODE.SERVER_ERROR);
    }
    return content;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 流式对话：逐段产出增量文本，超时与外部中止均会打断上游请求
 * @param messages 消息序列
 * @param options 选项
 * @returns AsyncGenerator<string>
 */
export async function* chatStream(
  messages: ChatMessage[],
  options: ChatOptions = {},
): AsyncGenerator<string> {
  const controller = new AbortController();
  linkAbortSignal(options.signal, controller);
  // 超时联动：外部已中止则立即中止目标 controller
  const timer = setTimeout(
    () => controller.abort(),
    options.timeout ?? config.deepseek.timeout,
  );
  try {
    const response = await doRequest(
      messages,
      true,
      controller.signal,
      options,
    );
    if (!response.body) {
      throw new ApiError("AI 响应格式异常", RESPONSE_CODE.SERVER_ERROR);
    }
    yield* parseSSEStream(response.body);
  } finally {
    clearTimeout(timer);
  }
}
