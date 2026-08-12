// 引入 express 模块
import express from "express";
// 引入控制器模块
import * as babyController from "@/controllers/baby/baby.controller";

// 创建路由实例
const router = express.Router();

/**
 * @openapi
 * /api/v1/baby/info:
 *   get:
 *     tags: [Baby]
 *     summary: 获取宝宝信息
 *     description: 返回单条宝宝记录，不存在时自动创建默认记录
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
 *                       $ref: "#/components/schemas/Baby"
 */
router.get("/info", babyController.getBabyInfo);

/**
 * @openapi
 * /api/v1/baby/update:
 *   put:
 *     tags: [Baby]
 *     summary: 更新宝宝信息
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string, description: 宝宝姓名 }
 *               birthday: { type: string, format: date, description: 宝宝生日 }
 *               avatar: { type: string, description: 头像 URL }
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: "#/components/schemas/ApiResponse"
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: "#/components/schemas/Baby"
 */
router.put("/update", babyController.updateBabyInfo);

export default router;
