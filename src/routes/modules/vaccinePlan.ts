// 引入 express 模块
import express from "express";
// 导入控制器
import {
  getVaccinePlan,
  saveVaccinePlan,
} from "@/controllers/vaccinePlan/vaccinePlan.controller";
// 引入校验中间件与规则
import {
  getVaccinePlanValidator,
  saveVaccinePlanValidator,
} from "@/validators";
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取接种计划
router.post(
  "/detail",
  getVaccinePlanValidator,
  validateMiddleware,
  getVaccinePlan,
);
// 保存接种计划
router.post(
  "/save",
  saveVaccinePlanValidator,
  validateMiddleware,
  saveVaccinePlan,
);

export default router;
