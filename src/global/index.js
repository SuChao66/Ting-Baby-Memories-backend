// 引入第三方中间件模块
const registerThirdPartyMiddleware = require("./register.third.middleware");
const notFoundMiddleware = require("../middlewares/notFound.middleware");
const errorMiddleware = require("../middlewares/error.middleware");

// 注册前置中间件（路由之前）
const registerPreMiddleware = (app) => {
  registerThirdPartyMiddleware(app);
};

// 注册后置中间件（路由之后：404 + 错误处理必须在所有路由之后）
const registerPostMiddleware = (app) => {
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
};

module.exports = { registerPreMiddleware, registerPostMiddleware };
