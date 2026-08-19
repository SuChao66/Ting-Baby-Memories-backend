// 引入 express 模块
import express from "express";
// 引入控制器模块
import {
  getBabyList,
  getBabyInfo,
  updateBabyInfo,
  addBaby,
} from "@/controllers/baby/baby.controller";
// 引入校验规则
import { addValidator } from "@/validators";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";

// 创建路由实例
const router = express.Router();

// 定义路由
// 获取宝宝列表
router.get("/list", getBabyList);
// 新增宝宝
router.post("/add", addValidator, validateMiddleware, addBaby);
// 获取宝宝信息 （单条记录）
router.get("/info", getBabyInfo);
// 更新宝宝信息
router.post("/update", updateBabyInfo);

export default router;
