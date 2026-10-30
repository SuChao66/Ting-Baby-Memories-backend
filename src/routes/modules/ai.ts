// 引入 express 模块
import express from "express";
// 导入控制器
import { chat, chatStream } from "@/controllers/ai/ai.controller";
// 引入校验中间件与规则
import { chatValidator } from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";
// 引入 AI 专用速率限制
import aiRateLimiter from "@/middlewares/aiRateLimit.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 普通对话（一次性返回完整回答）
router.post("/chat", aiRateLimiter, chatValidator, validateMiddleware, chat);
// 流式对话（SSE 逐段返回）
router.post(
  "/chat/stream",
  aiRateLimiter,
  chatValidator,
  validateMiddleware,
  chatStream,
);

export default router;
