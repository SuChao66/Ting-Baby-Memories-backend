// 引入 express 模块
import express from "express";
// 引入 swagger 相关模块
import swaggerUi from "swagger-ui-express";
import { swagger } from "@/utils";
// 引入注册中间件模块
import { registerPreMiddleware, registerPostMiddleware } from "@/global/index";
// 引入路由模块
import routes from "@/routes";

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

export default app;
