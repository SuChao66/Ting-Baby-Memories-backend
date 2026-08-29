import { body, query } from "express-validator";

export const getTimeLineValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("babyId不能为空"),
  body("page").notEmpty().withMessage("page不能为空"),
  body("page").isInt({ min: 1 }).toInt(),
  body("pageSize").notEmpty().withMessage("pageSize不能为空"),
  body("pageSize").isInt({ min: 10 }).toInt(),
];

export const addTimeLineValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("babyId不能为空"),
  body("content").isString().trim().notEmpty().withMessage("发布内容不能为空"),
  body("publishTime").isISO8601().withMessage("发布时间格式不正确"),
  body("isMilestone").notEmpty().isBoolean().withMessage("请设置是否大事件"),
  body("visibleRoles")
    .isIn(["public", "family", "private"])
    .withMessage("查看范围不合法"),
  body("files").optional().isArray(),
  body("files.*.url").isString().notEmpty(),
  body("files.*.type").isIn(["IMAGE", "VIDEO"]),
  body("tags").optional().isArray(),
  body("tags.*").isString(),
];

export const editTimeLineValidator = [
  ...addTimeLineValidator,
  body("id").isString().trim().notEmpty().withMessage("记录id不能为空"),
];

export const getTimeLineInfoValidator = [
  query("id").isString().notEmpty().withMessage("记录id不能为空"),
];

export const deleteTimeLineInfoValidator = [
  query("id").isString().notEmpty().withMessage("记录id不能为空"),
];
