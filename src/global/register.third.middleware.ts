// 引入中间件模块
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimitMiddleware from "@/middlewares/rateLimit.middleware";
import config from "@/config";
import type { Express } from "express";

// 注册第三方中间件
const registerThirdPartyMiddleware = (app: Express) => {
  // 跨域中间件
  app.use(
    cors({
      origin: config.corsOrigins,
      methods: ["GET", "POST", "PUT", "DELETE"],
    }),
  );
  // 安全中间件, 设置响应头, 防止 XSS 攻击, SQL 注入等
  app.use(helmet());
  // 速率限制中间件, 防止接口被恶意高频调用
  app.use("/api", rateLimitMiddleware);
  // 日志中间件
  if (config.env !== "test") {
    app.use(morgan("dev"));
  }
};

export default registerThirdPartyMiddleware;
