// 引入 express 模块
import express from "express";
// 引入路由模块
import babyRouter from "@/routes/modules/baby";
import timelineRouter from "@/routes/modules/timeline";

// 创建路由实例
const router = express.Router();

// 注册路由
router.use("/v1/baby", babyRouter);
router.use("/v1/timeline", timelineRouter);

export default router;
