// 结构化日志，支持日志分级、控制台输出、按天切割文件落盘
// 日志分级：info, debug, error, warn
// 控制台输出：info, debug
// 按天切割文件落盘：app-%DATE%.log, error-%DATE%.log
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import config from "@/config";

// 日志记录器
const logger = createLogger({
  level: config.env === "production" ? "info" : "debug",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
    new DailyRotateFile({
      filename: path.join("logs", "app-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
    new DailyRotateFile({
      level: "error",
      filename: path.join("logs", "error-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
    }),
  ],
});

export default logger;
