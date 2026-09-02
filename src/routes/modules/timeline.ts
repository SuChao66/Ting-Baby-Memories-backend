// 引入 express 模块
import express from "express";
// 导入controller
import {
  getTimeline,
  addTimeLine,
  editTimeLine,
  getTimeLineInfo,
  deleteTimeLineInfo,
  publishComment,
  getFileList,
} from "@/controllers/timeline/timeline.controller";
// 导入校验器
import {
  addTimeLineValidator,
  editTimeLineValidator,
  getTimeLineValidator,
  getTimeLineInfoValidator,
  deleteTimeLineInfoValidator,
  commentValidator,
  getFileListValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

const router = express.Router();

// 定义路由
router.post("/list", getTimeLineValidator, validateMiddleware, getTimeline);
router.post("/add", addTimeLineValidator, validateMiddleware, addTimeLine);
router.post("/edit", editTimeLineValidator, validateMiddleware, editTimeLine);
router.get(
  "/info",
  getTimeLineInfoValidator,
  validateMiddleware,
  getTimeLineInfo,
);
router.delete(
  "/delete",
  deleteTimeLineInfoValidator,
  validateMiddleware,
  deleteTimeLineInfo,
);
router.post("/comment", commentValidator, validateMiddleware, publishComment);
router.post("/fileList", getFileListValidator, validateMiddleware, getFileList);

export default router;
