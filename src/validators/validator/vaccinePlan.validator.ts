import { body } from "express-validator";

/** 获取接种计划规则 */
export const getVaccinePlanValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
];

/** 保存接种计划规则（整份覆盖） */
export const saveVaccinePlanValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
  body("keys").isArray().withMessage("接种计划不合法"),
  body("keys.*")
    .isString()
    .trim()
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage("剂次标识不合法"),
];
