// 引入mongoose
const mongoose = require("mongoose");
// 引入app.js
const app = require("./app");
// 引入config.js
const config = require("./config");
// 引入日志模块
const { logger } = require("./utils");

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
  .catch((err) => {
    logger.error("[MongoDB] 连接失败:", err.message);
    process.exit(1);
  });
