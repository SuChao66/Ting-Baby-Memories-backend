// 环境配置加载
require("dotenv").config();

// 当前环境
const env = process.env.NODE_ENV || "development";

// 速率限制配置（区分环境）
const rateLimitConfig = env === "production"
  ? {
    WINDOW_MS: 15 * 60 * 1000, // 生产环境: 15 分钟窗口
    MAX: 100,                  // 生产环境: 每个 IP 最多 100 次请求
  }
  : {
    WINDOW_MS: 60 * 1000,      // 开发环境: 1 分钟窗口
    MAX: 1000,                 // 开发环境: 每个 IP 最多 1000 次请求
  };

module.exports = {
  env,
  ...rateLimitConfig,
  CODE: 429, // 429 状态码
  MESSAGE: "请求过于频繁，请稍后再试", // 错误消息
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/ting-baby-memories",
  corsOrigins: process.env.CORS_ORIGINS || "http://localhost:5173",
};
