// 引入express
import express from "express";
// 引入用户控制器
import {
  login,
  register,
  forgetPassword,
} from "@/controllers/user/user.controller";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 引入登录校验规则
import {
  loginValidator,
  registerOrForgetPasswordValidator,
} from "@/validators";

// 创建路由实例
const router = express.Router();

router.post("/login", loginValidator, validateMiddleware, login);
router.post(
  "/register",
  registerOrForgetPasswordValidator,
  validateMiddleware,
  register,
);
router.post(
  "/forget_password",
  registerOrForgetPasswordValidator,
  validateMiddleware,
  forgetPassword,
);

export default router;
