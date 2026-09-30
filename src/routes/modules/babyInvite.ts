// 引入 express 模块
import express from "express";
// 引入鉴权中间件
import authMiddleware from "@/middlewares/auth.middleware";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 导入参数校验规则
import {
  createInviteLinkValidator,
  getPreviewInfoValidator,
} from "@/validators";
// 导入控制器模块
import {
  createInviteLink,
  getPreviewInfo,
} from "@/controllers/babyInvite/babyInvite.controller";

// 创建路由实例
const router = express.Router();

// 定义路由
// 生成链接
router.post(
  "/create_invite_link",
  createInviteLinkValidator,
  validateMiddleware,
  authMiddleware,
  createInviteLink,
);
// 获取邀请页面预览信息——无需鉴权
router.get(
  "/get_preview_info",
  getPreviewInfoValidator,
  validateMiddleware,
  getPreviewInfo,
);

export default router;
