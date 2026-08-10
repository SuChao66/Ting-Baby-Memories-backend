// 引入 express 模块
const express = require("express");
// 引入 swagger 相关模块
const swaggerUi = require("swagger-ui-express");
const { swagger } = require("./utils");
// 引入注册中间件模块
const {
  registerPreMiddleware,
  registerPostMiddleware,
} = require("./global/index");
// 引入路由模块
const routes = require("./routes");

// 创建 express 应用实例
const app = express();

// 注册前置中间件（cors/helmet/rateLimit/morgan）
registerPreMiddleware(app);
// parse requests with a Content-Type of application/json
app.use(express.json());
// parse requests with a Content-Type of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 注册路由
app.use("/api", routes);

// Swagger 接口文档
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

// 注册后置中间件（404 + 错误处理，必须在路由之后）
registerPostMiddleware(app);

module.exports = app;
