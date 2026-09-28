import { body, query } from "express-validator";
// 导入常量
import {
  SYMPTOM_RECORD_TYPES,
  SYMPTOM_OPTIONS,
  MEDICATION_USAGE_TYPES,
  TEMPERATURE_RANGE,
} from "@/enums";

// 新增记录规则

/** 空字符串转 undefined（前端未选择的枚举字段会传空字符串，需跳过校验并避免入库） */
const emptyToUndefined = (value: string) => (value === "" ? undefined : value);

export const addSymptomRecordValidator = [
  /** 公共字段 */
  body("babyId").isMongoId().withMessage("宝宝id不合法"),
  body("type")
    .isIn(Object.values(SYMPTOM_RECORD_TYPES))
    .withMessage("记录类型不合法"),
  body("startTime")
    .isISO8601()
    .withMessage("记录时间格式不正确")
    .custom((value) => new Date(value).getTime() <= Date.now())
    .withMessage("记录时间不能晚于当前时间"),
  body("remark")
    .optional()
    .isString()
    .isLength({ max: 200 })
    .withMessage("备注最多200字"),

  /** 体温：type=temperature 时体温值必填 */
  body("temperature")
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.TEMPERATURE))
    .isFloat({ min: TEMPERATURE_RANGE.MIN, max: TEMPERATURE_RANGE.MAX })
    .withMessage(
      `体温需在${TEMPERATURE_RANGE.MIN}℃~${TEMPERATURE_RANGE.MAX}℃之间`,
    )
    .toFloat(),
  body("temperature")
    .optional()
    .isFloat({ min: TEMPERATURE_RANGE.MIN, max: TEMPERATURE_RANGE.MAX })
    .withMessage(
      `体温需在${TEMPERATURE_RANGE.MIN}℃~${TEMPERATURE_RANGE.MAX}℃之间`,
    )
    .toFloat(),

  /** 症状：type=symptom 时症状列表必填 */
  body("symptoms")
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.SYMPTOM))
    .isArray({ min: 1 })
    .withMessage("症状不能为空"),
  body("symptoms")
    .optional()
    .isArray()
    .custom((value: unknown[]) =>
      value.every((item) =>
        (SYMPTOM_OPTIONS as readonly string[]).includes(item as string),
      ),
    )
    .withMessage("症状不合法"),

  /** 用药：type=medication 时药品名称必填 */
  body("medicineName")
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.MEDICATION))
    .isString()
    .trim()
    .notEmpty()
    .withMessage("药品名称不能为空"),
  body("medicineName").optional().isString().trim(),
  body("dosage").optional().isString().trim(),
  /** 用药：type=medication 时使用类型必填（internal-内服 / external-外用） */
  body("medicineType")
    .customSanitizer(emptyToUndefined)
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.MEDICATION))
    .isIn(Object.values(MEDICATION_USAGE_TYPES))
    .withMessage("药品使用类型不合法"),
  body("medicineType")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn(Object.values(MEDICATION_USAGE_TYPES))
    .withMessage("药品使用类型不合法"),

  /** 看医生：就诊医院/科室/医生 */
  body("hospital").optional().isString().trim(),
  body("department").optional().isString().trim(),
  body("doctor").optional().isString().trim(),

  /** 看医生：type=doctor 时就诊原因/诊断必填 */
  body("diagnosis")
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.DOCTOR))
    .isString()
    .trim()
    .notEmpty()
    .withMessage("就诊原因或诊断不能为空"),
  body("diagnosis").optional().isString().trim(),
  body("advice").optional().isString().trim(),

  /** 备忘：type=memo 时备忘内容必填 */
  body("content")
    .if(body("type").equals(SYMPTOM_RECORD_TYPES.MEMO))
    .isString()
    .trim()
    .notEmpty()
    .withMessage("备忘内容不能为空"),
  body("content").optional().isString().trim(),
];

// 编辑记录规则
export const editSymptomRecordValidator = [
  ...addSymptomRecordValidator,
  body("id").isMongoId().notEmpty().withMessage("记录id不可为空"),
];

// 删除记录规则
export const deleteSymptomRecordValidator = [
  query("id").isMongoId().notEmpty().withMessage("记录id不能为空"),
];

// 获取记录列表规则
export const getSymptomRecordListValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
  body("type")
    .customSanitizer(emptyToUndefined)
    .optional()
    .isIn(Object.values(SYMPTOM_RECORD_TYPES))
    .withMessage("记录类型不合法"),
  body("date")
    .notEmpty()
    .withMessage("date不能为空")
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("日期格式不正确，应为YYYY-MM-DD")
    .custom((value) => !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()))
    .withMessage("日期不合法"),
];
