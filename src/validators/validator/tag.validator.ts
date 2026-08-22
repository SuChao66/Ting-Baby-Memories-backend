import { body, query } from "express-validator";

export const addTagValidator = [
  body("name").isString().trim().notEmpty().withMessage("标签名不能为空"),
];

export const deleteTagValidator = [
  query("id").isString().notEmpty().withMessage("标签id不能为空"),
];
