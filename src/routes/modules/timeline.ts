// 引入 express 模块
import express from "express";
// 导入controller
import { getTimeline } from "@/controllers/timeline/timeline.controller";

const router = express.Router();

// 定义路由
router.get("/get_timeline", getTimeline);

export default router;
