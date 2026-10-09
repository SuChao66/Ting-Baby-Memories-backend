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

// 关联宝宝规则
export const bindBabyValidator = [
  body("baby_no").isString().notEmpty().withMessage("请输入宝宝号"),
  body("relation").isString().notEmpty().withMessage("请选择与宝宝关系"),
];
