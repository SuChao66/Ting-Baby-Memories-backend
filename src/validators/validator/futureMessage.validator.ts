import { body, query } from "express-validator";

// 新增寄语规则
export const addFutureMessageValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
  body("content").isString().trim().notEmpty().withMessage("请输入寄语内容"),
  body("revealDate")
    .isISO8601()
    .withMessage("解锁日期格式不正确")
    .custom((value) => new Date(value).getTime() > Date.now())
    .withMessage("解锁日期必须晚于当前时间"),
  body("visibleRoles")
    .isIn(["public", "family", "private"])
    .withMessage("可见范围不合法"),
  body("files").optional().isArray(),
  body("files.*.url").isString().notEmpty(),
  body("files.*.type").isIn(["IMAGE", "VIDEO", "AUDIO"]),
];

// 更新寄语规则
export const updateFutureMessageValidator = [
  ...addFutureMessageValidator,
  body("id").isMongoId().notEmpty().withMessage("寄语id不能为空"),
];

// 删除寄语规则
export const deleteFutureMessageValidator = [
  query("id").isMongoId().notEmpty().withMessage("寄语id不能为空"),
];

// 获取寄语列表规则
export const getFutureMessageListValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
  body("page").notEmpty().withMessage("page不能为空"),
  body("page").isInt({ min: 1 }).toInt(),
  body("pageSize").notEmpty().withMessage("pageSize不能为空"),
  body("pageSize").isInt({ min: 10 }).toInt(),
];
