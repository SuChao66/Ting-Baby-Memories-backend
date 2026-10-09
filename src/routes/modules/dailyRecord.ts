// 引入 express 模块
import express from "express";
// 导入控制器
import {
  getDailyRecordList,
  addDailyRecord,
  editDailyRecord,
  deleteDailyRecord,
} from "@/controllers/dailyRecord/dailyRecord.controller";
// 引入校验中间件与规则
import {
  addDailyRecordValidator,
  editDailyRecordValidator,
  deleteDailyRecordValidator,
  getDailyRecordListValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取列表
router.post(
  "/list",
  getDailyRecordListValidator,
  validateMiddleware,
  getDailyRecordList,
);
// 新增记录
router.post(
  "/add",
  addDailyRecordValidator,
  validateMiddleware,
  addDailyRecord,
);
// 编辑记录
router.post(
  "/edit",
  editDailyRecordValidator,
  validateMiddleware,
  editDailyRecord,
);
// 删除记录
router.delete(
  "/delete",
  deleteDailyRecordValidator,
  validateMiddleware,
  deleteDailyRecord,
);

export default router;
