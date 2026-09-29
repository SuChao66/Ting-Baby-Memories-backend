// 引入 express 模块
import express from "express";
// 导入控制器
import {
  getVaccineRecordList,
  addVaccineRecord,
  editVaccineRecord,
  deleteVaccineRecord,
} from "@/controllers/vaccineRecord/vaccineRecord.controller";
// 引入校验中间件与规则
import {
  addVaccineRecordValidator,
  editVaccineRecordValidator,
  deleteVaccineRecordValidator,
  getVaccineRecordListValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取列表
router.post(
  "/list",
  getVaccineRecordListValidator,
  validateMiddleware,
  getVaccineRecordList,
);
// 新增记录
router.post(
  "/add",
  addVaccineRecordValidator,
  validateMiddleware,
  addVaccineRecord,
);
// 编辑记录
router.post(
  "/edit",
  editVaccineRecordValidator,
  validateMiddleware,
  editVaccineRecord,
);
// 删除记录
router.delete(
  "/delete",
  deleteVaccineRecordValidator,
  validateMiddleware,
  deleteVaccineRecord,
);

export default router;
