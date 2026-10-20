// 引入 express 模块
import express from "express";
// 引入 cookie-parser
import cookieParser from "cookie-parser";
// 引入 swagger 相关模块
import swaggerUi from "swagger-ui-express";
import { swagger } from "@/utils";
// 引入注册中间件模块
import { registerPreMiddleware, registerPostMiddleware } from "@/global/index";
// 引入路由模块
import routes from "@/routes";

// 创建 express 应用实例
const app = express();

// 反代链共两层：宝塔 nginx(宿主机) → frontend 容器 nginx → backend
// 信任两层代理，req.ip 才能穿透到 XFF 里的真实客户端 IP（容器视角 socket 恒为 frontend 容器 IP）
// 访问路径：用户 → 宝塔 nginx(宿主机) → frontend 容器 nginx → backend 容器
app.set("trust proxy", 2);

// 注册前置中间件（cors/helmet/rateLimit/morgan）
registerPreMiddleware(app);
// 解析 cookie
app.use(cookieParser());
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
