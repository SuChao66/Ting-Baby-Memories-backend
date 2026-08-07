// 引入 express 模块
const express = require("express");
// 引入控制器模块
const timelineController = require("../../controllers/timeline/timeline.controller");

// 创建路由实例
const router = express.Router();

// 时间线路由
router.get("/list", timelineController.getTimelineList);
router.post("/add", timelineController.addTimelineItem);
router.delete("/delete/:id", timelineController.deleteTimelineItem);

module.exports = router;
