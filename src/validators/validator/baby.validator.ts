import { body, query } from "express-validator";

// 新增宝宝规则
export const addBabyValidator = [
  body("nickname").notEmpty().withMessage("昵称不能为空"),
  body("gender").notEmpty().withMessage("未设置性别"),
  body("birthday").notEmpty().withMessage("请设置宝宝生日"),
];

// 获取宝宝信息
export const getBabyInfoValidator = [
  query("id").notEmpty().withMessage("id不能为空"),
];
