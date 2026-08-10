// 引入第三方中间件模块
const registerThirdPartyMiddleware = require("./register.third.middleware");
const requestIdMiddleware = require("../middlewares/requestId.middleware");
const notFoundMiddleware = require("../middlewares/notFound.middleware");
const errorMiddleware = require("../middlewares/error.middleware");

// 注册前置中间件（路由之前）
const registerPreMiddleware = (app) => {
  // 请求 ID 追踪，最早注册，保证后续中间件（morgan/logger）都能读到 req.id
  app.use(requestIdMiddleware);
  // 注册第三方中间件
  registerThirdPartyMiddleware(app);
};

// 注册后置中间件（路由之后：404 + 错误处理必须在所有路由之后）
const registerPostMiddleware = (app) => {
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
};

module.exports = { registerPreMiddleware, registerPostMiddleware };
