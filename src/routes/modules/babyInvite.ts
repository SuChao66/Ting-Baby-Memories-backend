// 引入 express 模块
import express from "express";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 导入参数校验规则
import { createInviteLinkValidator } from "@/validators";
// 导入控制器模块
import { createInviteLink } from "@/controllers/babyInvite/babyInvite.controller";

// 创建路由实例
const router = express.Router();

// 定义路由
// 生成链接
router.post(
  "/create_invite_link",
  createInviteLinkValidator,
  validateMiddleware,
  createInviteLink,
);

export default router;
