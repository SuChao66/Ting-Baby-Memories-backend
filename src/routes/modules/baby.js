// 引入 express 模块
const express = require("express");
// 引入控制器模块
const babyController = require("../../controllers/baby/baby.controller");

// 创建路由实例
const router = express.Router();

// 注册路由
router.get("/info", babyController.getBabyInfo);
router.put("/update", babyController.updateBabyInfo);

module.exports = router;
