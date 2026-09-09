// 引入 express 模块
import express from "express";
// 引入 auth 中间件
import validateMiddleware from "@/middlewares/validate.middleware";
// 引入验证器
import {
  addFutureMessageValidator,
  updateFutureMessageValidator,
  deleteFutureMessageValidator,
  getFutureMessageListValidator,
  getUnlockCountValidator,
  markFutureMessageReadValidator,
} from "@/validators";
// 导入控制器
import {
  getFutureMessageList,
  addFutureMessage,
  updateFutureMessage,
  deleteFutureMessage,
  getUnlockCount,
  markFutureMessageRead,
} from "@/controllers/futureMesaage/futureMessage.controller";

// 创建路由实例
const router = express.Router();

// 定义路由
router.post(
  "/list",
  getFutureMessageListValidator,
  validateMiddleware,
  getFutureMessageList,
);
router.post(
  "/add",
  addFutureMessageValidator,
  validateMiddleware,
  addFutureMessage,
);
router.post(
  "/update",
  updateFutureMessageValidator,
  validateMiddleware,
  updateFutureMessage,
);
router.delete(
  "/delete",
  deleteFutureMessageValidator,
  validateMiddleware,
  deleteFutureMessage,
);
router.get(
  "/unlock-count",
  getUnlockCountValidator,
  validateMiddleware,
  getUnlockCount,
);
router.post(
  "/read",
  markFutureMessageReadValidator,
  validateMiddleware,
  markFutureMessageRead,
);

export default router;
