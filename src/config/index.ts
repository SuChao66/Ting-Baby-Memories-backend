// 环境配置加载
import dotenv from "dotenv";

// 当前环境
const env = process.env.NODE_ENV || "development";

// 按环境加载对应的 .env 文件
dotenv.config({ path: `.env.${env}` });

// 速率限制配置（区分环境）
const rateLimitConfig =
  env === "production"
    ? {
        WINDOW_MS: 15 * 60 * 1000, // 生产环境: 15 分钟窗口
        MAX: 100, // 生产环境: 每个 IP 最多 100 次请求
      }
    : {
        WINDOW_MS: 60 * 1000, // 开发环境: 1 分钟窗口
        MAX: 1000, // 开发环境: 每个 IP 最多 1000 次请求
      };

// JWT 配置
const jwt = {
  jwtSecret: process.env.JWT_SECRET || "ting-baby-memories", // JWT 密钥
  expiresIn: process.env.JWT_EXPIRES_IN || "7d", // JWT 过期时间
};

const config = {
  env,
  ...rateLimitConfig,
  ...jwt,
  MESSAGE: "请求过于频繁，请稍后再试", // 错误消息
  port: Number(process.env.PORT) || 3000,
  mongoUri:
    process.env.MONGO_URI || "mongodb://localhost:27017/ting-baby-memories",
  corsOrigins: process.env.CORS_ORIGINS || "http://localhost:5173",
};

export default config;
