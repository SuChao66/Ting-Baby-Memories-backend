import { body } from "express-validator";
// 导入常量
import { AI_SCENES } from "@/enums";

// AI 对话规则（普通与流式接口共用）
export const chatValidator = [
  /** 用户问题 */
  body("question")
    .notEmpty()
    .withMessage("问题不能为空")
    .bail()
    .isString()
    .withMessage("问题必须是字符串")
    .bail()
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("问题长度需在 1-1000 字之间"),
  /** sessionCode */
  body("sessionCode")
    .notEmpty()
    .withMessage("sessionCode 不能为空")
    .bail()
    .isString()
    .withMessage("sessionCode 必须是字符串")
    .bail()
    .trim(),
  /** reqId */
  body("reqId")
    .notEmpty()
    .withMessage("reqId 不能为空")
    .bail()
    .isString()
    .withMessage("reqId 必须是字符串")
    .bail()
    .trim(),
  /** AI 场景（可选，不传走通用育儿助手） */
  body("scene")
    .optional({ values: "falsy" })
    .isIn(AI_SCENES as unknown as string[])
    .withMessage("场景不合法"),
  /** 宝宝月龄（可选，帮助模型给出月龄匹配的建议） */
  body("babyAge")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("宝宝月龄必须是字符串")
    .trim()
    .isLength({ max: 50 })
    .withMessage("宝宝月龄不能超过 50 字"),
  /** 多轮对话历史（可选，只允许 user / assistant 角色） */
  body("history")
    .optional({ values: "falsy" })
    .isArray({ max: 20 })
    .withMessage("对话历史最多 20 条"),
  body("history.*.role")
    .if(body("history").isArray({ min: 1 }))
    .isIn(["user", "assistant"])
    .withMessage("对话历史角色不合法"),
  body("history.*.content")
    .if(body("history").isArray({ min: 1 }))
    .isString()
    .withMessage("对话历史内容必须是字符串")
    .isLength({ max: 2000 })
    .withMessage("对话历史单条内容不能超过 2000 字"),
];

// 获取历史记录
export const getRecordValidator = [
  body("page").notEmpty().withMessage("page 不能为空"),
  body("page").isInt({ min: 1 }).toInt(),
  body("pageSize").notEmpty().withMessage("pageSize 不能为空"),
  body("pageSize").isInt({ min: 10 }).toInt(),
];

// 获取某个会话的问答明细规则
export const getRecordDetailValidator = [
  body("sessionCode")
    .notEmpty()
    .withMessage("sessionCode 不能为空")
    .bail()
    .isString()
    .withMessage("sessionCode 必须是字符串")
    .bail()
    .trim(),
];
