// 引入自定义中间件模块
const notFoundMiddleware = require("../middlewares/notFound.middleware");
const errorMiddleware = require("../middlewares/error.middleware");

// 注册自定义中间件
const registerCustomMiddleware = (app) => {
  // 404中间件
  app.use(notFoundMiddleware);
  // 错误处理中间件
  app.use(errorMiddleware);
};

module.exports = registerCustomMiddleware;
