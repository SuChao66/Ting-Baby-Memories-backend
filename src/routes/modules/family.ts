import express from "express";
// 引入校验规则
import { getFamilyListValidator, recordVisitValidator } from "@/validators";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 引入方法
import {
  getFamilyList,
  recordVisit,
} from "@/controllers/family/family.controller";

// 创建路由实例
const router = express.Router();

router.get("/list", getFamilyListValidator, validateMiddleware, getFamilyList);
router.post("/visit", recordVisitValidator, validateMiddleware, recordVisit);

export default router;
