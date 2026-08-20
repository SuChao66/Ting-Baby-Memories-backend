// 引入 express 模块
import express from "express";
// 引入路由模块
import userRouter from "@/routes/modules/user";
import babyRouter from "@/routes/modules/baby";
import uploadRouter from "@/routes/modules/upload";
import timelineRouter from "@/routes/modules/timeline";
// 引入鉴权中间件
import authMiddleware from "@/middlewares/auth.middleware";

// 创建路由实例
const router = express.Router();

// 用户路由
router.use("/v1/user", userRouter);
router.use("/v1/upload", authMiddleware, uploadRouter);
router.use("/v1/baby", authMiddleware, babyRouter);
router.use("/v1/timeline", authMiddleware, timelineRouter);

export default router;
