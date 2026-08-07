// 速率限制中间件
const rateLimit = require("express-rate-limit");
// 引入配置模块
const config = require("../config/index");

// 速率限制中间件
const limiter = rateLimit({
  windowMs: config.WINDOW_MS, // 15 分钟窗口
  max: config.MAX, // 每个 IP 最多 100 次请求
  message: { code: config.CODE, message: config.MESSAGE, data: null },
});

module.exports = limiter;
