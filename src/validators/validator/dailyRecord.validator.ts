import { body, query } from "express-validator";
// 导入常量
import {
  DAILY_RECORD_TYPES,
  DIAPER_STATUS,
  BREAST_FEED_MODE,
  BREAST_SIDE,
  POOP_COLOR_OPTIONS,
  POOP_SHAPE_OPTIONS,
  PEE_AMOUNT_OPTIONS,
} from "@/enums";

// 新增记录规则

/** 空字符串转 undefined（前端未选择的枚举字段会传空字符串，需跳过校验并避免入库） */
const emptyToUndefined = (value: string) => (value === "" ? undefined : value);

export const addDailyRecordValidator = [
  /** 公共字段 */
  body("babyId").isMongoId().withMessage("宝宝id不合法"),
  body("type")
    .isIn(Object.values(DAILY_RECORD_TYPES))
    .withMessage("记录类型不合法"),
  body("startTime")
    .isISO8601()
    .withMessage("开始时间格式不正确")
    .custom((value) => new Date(value).getTime() <= Date.now())
    .withMessage("开始时间不能晚于当前时间"),
  body("remark")
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage("备注最多200字"),

  /** 洗澡、睡眠、玩耍、游泳、其他事件：持续时间 */
  body("duration")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("持续时间必须为非负数")
    .toFloat(),

  /** 其他事件：type=other 时事件名称必填 */
  body("eventName")
    .if(body("type").equals(DAILY_RECORD_TYPES.OTHER))
    .isString()
    .trim()
    .notEmpty()
    .withMessage("事件名称不能为空"),
  body("eventName").optional().isString().trim(),

  /** 辅食：type=food 时辅食名称必填 */
  body("foodName")
    .if(body("type").equals(DAILY_RECORD_TYPES.FOOD))
    .isString()
    .trim()
    .notEmpty()
    .withMessage("辅食名称不能为空"),
  body("foodName").optional().isString().trim(),
  body("foodWeight").optional().isString().trim(),

  /** 换尿布：type=diaper 时尿布状态必填 */
  body("status")
    .if(body("type").equals(DAILY_RECORD_TYPES.DIAPER))
    .isIn(Object.values(DIAPER_STATUS))
    .withMessage("尿布状态不合法"),
  body("status")
    .optional()
    .isIn(Object.values(DIAPER_STATUS))
    .withMessage("尿布状态不合法"),
  body("poopColor")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn([...POOP_COLOR_OPTIONS])
    .withMessage("臭臭颜色不合法"),
  body("poopShape")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn([...POOP_SHAPE_OPTIONS])
    .withMessage("臭臭形状不合法"),
  body("peeAmount")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn([...PEE_AMOUNT_OPTIONS])
    .withMessage("尿量不合法"),
  body("hasRash").optional().isBoolean().toBoolean(),

  // 亲喂
  body("breastMode")
    .optional()
    .isIn(Object.values(BREAST_FEED_MODE))
    .withMessage("亲喂模式不合法"),
  body("leftDuration")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("左侧喂时长必须为非负数")
    .toFloat(),
  body("rightDuration")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("右侧喂时长必须为非负数")
    .toFloat(),
  body("lastUsedSide")
    .optional()
    .isIn(Object.values(BREAST_SIDE))
    .withMessage("最后使用侧类别不合法"),
  body("estimatedAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("预估奶量必须为非负数")
    .toFloat(),

  // 瓶喂
  body("formulaAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("配方奶量必须为非负数")
    .toFloat(),
  body("breastMilkAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("母乳量必须为非负数")
    .toFloat(),
];

// 编辑记录规则
export const editDailyRecordValidator = [
  ...addDailyRecordValidator,
  body("id").isMongoId().notEmpty().withMessage("记录id不可为空"),
];

// 删除记录规则
export const deleteDailyRecordValidator = [
  query("id").isMongoId().notEmpty().withMessage("记录id不能为空"),
];

// 获取记录列表规则
export const getDailyRecordListValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
  body("type")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn(Object.values(DAILY_RECORD_TYPES))
    .withMessage("记录类型不合法"),
  body("date")
    .notEmpty()
    .withMessage("date不能为空")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("日期格式不正确，应为YYYY-MM-DD")
    .custom((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()))
    .withMessage("日期不合法"),
];
