// 引入 express 模块
import express from "express";
// 导入校验
import { addTagValidator, deleteTagValidator } from "@/validators";
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
router.post("/add", addTagValidator, addTag);
router.delete("/delete", deleteTagValidator, deleteTag);

export default router;
