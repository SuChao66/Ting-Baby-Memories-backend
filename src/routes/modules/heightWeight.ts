// 引入 express 模块
import express from "express";
// 导入控制器
import {
  getHeightWeightList,
  addHeightWeight,
  editHeightWeight,
  deleteHeightWeight,
} from "@/controllers/heightWeight/heightWeight.controller";
// 引入校验中间件与规则
import {
  addHeightWeightValidator,
  editHeightWeightValidator,
  deleteHeightWeightValidator,
  getHeightWeightListValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取列表
router.post(
  "/list",
  getHeightWeightListValidator,
  validateMiddleware,
  getHeightWeightList,
);
// 新增记录
router.post(
  "/add",
  addHeightWeightValidator,
  validateMiddleware,
  addHeightWeight,
);
// 编辑记录
router.post(
  "/edit",
  editHeightWeightValidator,
  validateMiddleware,
  editHeightWeight,
);
// 删除记录
router.delete(
  "/delete",
  deleteHeightWeightValidator,
  validateMiddleware,
  deleteHeightWeight,
);

export default router;
