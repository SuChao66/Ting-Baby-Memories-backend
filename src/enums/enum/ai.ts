/** AI 场景取值（与前端 AI 功能入口一一对应） */
export const AI_SCENES = ["record", "weekly", "insight"] as const;

/** 对话历史最多保留条数，防止上下文超限 */
export const MAX_HISTORY = 10;
