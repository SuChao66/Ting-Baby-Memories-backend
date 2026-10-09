import { body, query } from "express-validator";

// 空字符串转为 undefined（可选字段不传空串）
const emptyToUndefined = (value: string) => (value === "" ? undefined : value);

// 新增记录规则
export const addHeightWeightValidator = [
  /** 公共字段 */
  body("babyId").notEmpty().isMongoId().withMessage("宝宝id不合法"),
  body("date")
    .isISO8601()
    .withMessage("时间格式不正确")
    .custom((value) => new Date(value).getTime() <= Date.now())
    .withMessage("时间不能晚于当前时间"),
  /** 身高、体重、头围 */
  body("height")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("身高必须大于0")
    .toFloat(),
  body("weight")
    .notEmpty()
    .isFloat({ gt: 0 })
    .withMessage("体重必须大于0")
    .toFloat(),
  body("head")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("头围必须大于0")
    .toFloat(),
];

// 编辑记录规则
export const editHeightWeightValidator = [
  ...addHeightWeightValidator,
  body("id").isMongoId().notEmpty().withMessage("记录id不可为空"),
];

// 删除记录规则
export const deleteHeightWeightValidator = [
  query("id").isMongoId().notEmpty().withMessage("记录id不能为空"),
];

// 获取记录列表规则
export const getHeightWeightListValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
];
