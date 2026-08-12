// 引入mongoose
import mongoose from "mongoose";
// 引入app.js
import app from "@/app";
// 引入config.js
import config from "@/config";
// 引入日志模块
import { logger } from "@/utils";

// 连接 MongoDB, 并启动服务
mongoose
  .connect(config.mongoUri)
  .then(() => {
    logger.info("[MongoDB] 连接成功");
    // 启动服务
    app.listen(config.port, () => {
      logger.info(`[Server] 服务已启动，端口: ${config.port} (${config.env})`);
    });
  })
  .catch((err: Error) => {
    logger.error("[MongoDB] 连接失败:", err.message);
    process.exit(1);
  });
