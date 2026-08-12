// 引入 express 模块
import express from "express";
// 引入控制器模块
import * as timelineController from "@/controllers/timeline/timeline.controller";

// 创建路由实例
const router = express.Router();

/**
 * @openapi
 * /api/v1/timeline/list:
 *   get:
 *     tags: [Timeline]
 *     summary: 获取时间线列表
 *     description: 按日期倒序返回所有时间线记录
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: "#/components/schemas/TimelineItem"
 */
router.get("/list", timelineController.getTimelineList);

/**
 * @openapi
 * /api/v1/timeline/add:
 *   post:
 *     tags: [Timeline]
 *     summary: 新增时间线项
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, date]
 *             properties:
 *               title: { type: string, description: 标题 }
 *               description: { type: string, description: 描述 }
 *               date: { type: string, format: date, description: 日期 }
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/TimelineItem"
 */
router.post("/add", timelineController.addTimelineItem);

/**
 * @openapi
 * /api/v1/timeline/delete/{id}:
 *   delete:
 *     tags: [Timeline]
 *     summary: 删除时间线项
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: 时间线项 ID
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ApiResponse"
 *       404:
 *         description: 时间线项不存在
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     code: { type: integer, example: 404 }
 *                     message: { type: string, example: 时间线项不存在 }
 */
router.delete("/delete/:id", timelineController.deleteTimelineItem);

export default router;
