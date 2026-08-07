// 引入 express 模块
const express = require("express");
// 引入路由模块
const babyRouter = require("./modules/baby");
const timelineRouter = require("./modules/timeline");

// 创建路由实例
const router = express.Router();

// 注册路由
router.get("/v1/baby", babyRouter);
router.get("/v1/timeline", timelineRouter);

module.exports = router;
