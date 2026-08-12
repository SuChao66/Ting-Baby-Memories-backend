// 引入第三方中间件模块
import registerThirdPartyMiddleware from "@/global/register.third.middleware";
import requestIdMiddleware from "@/middlewares/requestId.middleware";
import notFoundMiddleware from "@/middlewares/notFound.middleware";
import errorMiddleware from "@/middlewares/error.middleware";
import type { Express } from "express";

// 注册前置中间件（路由之前）
const registerPreMiddleware = (app: Express) => {
  // 请求 ID 追踪，最早注册，保证后续中间件（morgan/logger）都能读到 req.id
  app.use(requestIdMiddleware);
  // 注册第三方中间件
  registerThirdPartyMiddleware(app);
};

// 注册后置中间件（路由之后：404 + 错误处理必须在所有路由之后）
const registerPostMiddleware = (app: Express) => {
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
};

export { registerPreMiddleware, registerPostMiddleware };
