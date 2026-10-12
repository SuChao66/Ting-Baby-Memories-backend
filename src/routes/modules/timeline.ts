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
  toggleLike,
  getAllTimeline,
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
  likeValidator,
  getAllTimeLineValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

const router = express.Router();

// 定义路由
// 获取记录列表
router.post("/list", getTimeLineValidator, validateMiddleware, getTimeline);
// 新增记录
router.post("/add", addTimeLineValidator, validateMiddleware, addTimeLine);
// 编辑记录
router.post("/edit", editTimeLineValidator, validateMiddleware, editTimeLine);
// 获取记录详情
router.get(
  "/info",
  getTimeLineInfoValidator,
  validateMiddleware,
  getTimeLineInfo,
);
// 删除记录
router.delete(
  "/delete",
  deleteTimeLineInfoValidator,
  validateMiddleware,
  deleteTimeLineInfo,
);
// 点赞/取消点赞
router.post("/like", likeValidator, validateMiddleware, toggleLike);
// 评论
router.post("/comment", commentValidator, validateMiddleware, publishComment);
// 获取文件列表
router.post("/fileList", getFileListValidator, validateMiddleware, getFileList);
// 获取所有记录
router.post(
  "/all",
  getAllTimeLineValidator,
  validateMiddleware,
  getAllTimeline,
);

export default router;
