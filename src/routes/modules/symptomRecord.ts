// 引入 express 模块
import express from "express";
// 导入控制器
import {
  getSymptomRecordList,
  addSymptomRecord,
  editSymptomRecord,
  deleteSymptomRecord,
} from "@/controllers/symptomRecord/symptomRecord.controller";
// 引入校验中间件与规则
import {
  addSymptomRecordValidator,
  editSymptomRecordValidator,
  deleteSymptomRecordValidator,
  getSymptomRecordListValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取列表
router.post(
  "/list",
  getSymptomRecordListValidator,
  validateMiddleware,
  getSymptomRecordList,
);
// 新增记录
router.post(
  "/add",
  addSymptomRecordValidator,
  validateMiddleware,
  addSymptomRecord,
);
// 编辑记录
router.post(
  "/edit",
  editSymptomRecordValidator,
  validateMiddleware,
  editSymptomRecord,
);
// 删除记录
router.delete(
  "/delete",
  deleteSymptomRecordValidator,
  validateMiddleware,
  deleteSymptomRecord,
);

export default router;
