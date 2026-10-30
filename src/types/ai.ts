/** 对话消息 */
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** 单次调用可选参数 */
export interface ChatOptions {
  /** 透传外部中止信号（如客户端断开连接时联动中止上游请求） */
  signal?: AbortSignal;
  /** 采样温度（0-2），不传时使用全局配置 */
  temperature?: number;
  /** 最大输出 token 数 */
  maxTokens?: number;
  /** 超时毫秒数，不传时使用全局配置 */
  timeout?: number;
}

/** DeepSeek 非流式响应结构（仅声明用到的字段） */
export interface ChatCompletionResponse {
  choices?: {
    message?: { content?: string };
  }[];
}

/** DeepSeek 流式响应单帧结构（仅声明用到的字段） */
export interface ChatCompletionChunk {
  choices?: {
    delta?: { content?: string };
  }[];
}
