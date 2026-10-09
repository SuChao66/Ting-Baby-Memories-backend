// 引入 express 模块
import express from "express";
// 导入校验
import { addTagValidator, deleteTagValidator } from "@/validators";
// 引入校验中间件与规则
import validateMiddleware from "@/middlewares/validate.middleware";
// 导入控制器
import {
  getTagsList,
  addTag,
  deleteTag,
} from "@/controllers/tags/tags.controller";

// 创建路由实例
const router = express.Router();

// 定义路由
router.get("/list", getTagsList);
router.post("/add", addTagValidator, validateMiddleware, addTag);
router.delete("/delete", deleteTagValidator, validateMiddleware, deleteTag);

export default router;
