// 引入 express 模块
const express = require("express");
// 引入注册中间件模块
const registerAllMiddleware = require("./global/index");
// 引入路由模块
const routes = require("./routes");

// 创建 express 应用实例
const app = express();

// 注册第三方中间件
registerAllMiddleware(app);
// parse requests with a Content-Type of application/json
app.use(express.json());
// parse requests with a Content-Type of application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// 注册路由
app.use("/api", routes);

module.exports = app;
