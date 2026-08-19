import { body } from "express-validator";

// 新增宝宝规则
export const addValidator = [
  body("nickname").notEmpty().withMessage("昵称不能为空"),
  body("gender").notEmpty().withMessage("未设置性别"),
  body("birthday").notEmpty().withMessage("请设置宝宝生日"),
];
