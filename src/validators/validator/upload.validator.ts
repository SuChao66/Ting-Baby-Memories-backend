import { body } from "express-validator";

// 获取上传文件的预签名URL校验规则
export const presignedUrlValidator = [
  body("filename").notEmpty().withMessage("文件名不能为空"),
  body("contentType").notEmpty().withMessage("文件类型不能为空"),
];
