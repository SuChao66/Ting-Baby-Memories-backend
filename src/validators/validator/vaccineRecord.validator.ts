import { body, query } from "express-validator";

/** 新增接种记录规则 */
export const addVaccineRecordValidator = [
  body("babyId").isMongoId().withMessage("宝宝id不合法"),
  // 关联剂次标识：自由补录时可为空
  body("doseKey")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("剂次标识不合法"),
  body("vaccineName")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("疫苗名称不能为空")
    .isLength({ max: 50 })
    .withMessage("疫苗名称最多50字"),
  body("dose")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("剂次不合法")
    .toInt(),
  body("injectDate")
    .isISO8601()
    .withMessage("接种日期格式不正确")
    .custom((value) => new Date(value).getTime() <= Date.now())
    .withMessage("接种日期不能晚于当前时间"),
  body("hospital")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("接种单位最多100字"),
  body("batchNo")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 50 })
    .withMessage("疫苗批号最多50字"),
  body("fee")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("费用不合法")
    .toFloat(),
  body("note")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 100 })
    .withMessage("备注最多100字"),
];

/** 编辑接种记录规则 */
export const editVaccineRecordValidator = [
  ...addVaccineRecordValidator,
  body("id").isMongoId().notEmpty().withMessage("记录id不可为空"),
];

/** 删除接种记录规则 */
export const deleteVaccineRecordValidator = [
  query("id").isMongoId().notEmpty().withMessage("记录id不能为空"),
];

/** 获取接种记录列表规则 */
export const getVaccineRecordListValidator = [
  body("babyId").isMongoId().notEmpty().withMessage("宝宝id不能为空"),
];
