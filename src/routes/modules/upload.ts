// 引入express
import express from "express";
// 引入用户控制器
import { getPresignedUrl } from "@/controllers/upload/upload.controller";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 引入获取上传文件的预签名URL校验规则
import { presignedUrlValidator } from "@/validators/validator/upload.validator";

// 创建路由实例
const router = express.Router();

// 获取上传文件的预签名URL
router.post(
  "/presigned",
  presignedUrlValidator,
  validateMiddleware,
  getPresignedUrl,
);

export default router;
