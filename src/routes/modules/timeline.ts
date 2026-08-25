// 引入 express 模块
import express from "express";
// 导入controller
import {
  getTimeline,
  addTimeLine,
} from "@/controllers/timeline/timeline.controller";
// 导入校验器
import { addTimeLineValidator, getTimeLineValidator } from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

const router = express.Router();

// 定义路由
router.post("/list", getTimeLineValidator, validateMiddleware, getTimeline);
router.post("/add", addTimeLineValidator, validateMiddleware, addTimeLine);

export default router;
