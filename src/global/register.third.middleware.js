// 引入中间件模块
// 跨域中间件
const cors = require("cors");
// 日志中间件
const morgan = require("morgan");
// 安全中间件
const helmet = require("helmet");
// 速率限制中间件
const rateLimitMiddleware = require("./rateLimit.middleware");
// 引入配置模块
const config = require("../config/index");

// 注册第三方中间件
const registerThirdPartyMiddleware = (app) => {
  // 跨域中间件
  app.use(cors({
    origin: config.corsOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }));
  // 安全中间件, 设置响应头, 防止 XSS 攻击, SQL 注入等
  app.use(helmet());
  // 速率限制中间件, 防止接口被恶意高频调用
  app.use("/api", rateLimitMiddleware);
  // 日志中间件
  if (config.env !== "test") {
    app.use(morgan("dev"));
  }
};

module.exports = registerThirdPartyMiddleware;
