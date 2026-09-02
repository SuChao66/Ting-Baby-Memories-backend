import { query, body } from "express-validator";

export const getFamilyListValidator = [
  query("babyId").isString().trim().notEmpty().withMessage("宝宝id不能为空"),
];

export const recordVisitValidator = [
  body("babyId").isString().trim().notEmpty().withMessage("宝宝id不能为空"),
];
