// AI 接口专用速率限制：大模型调用成本高，比全局限流更严格
import rateLimit from "express-rate-limit";
// 导入配置文件
import config from "@/config";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 开发环境 30 次/分钟，生产环境 10 次/分钟
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.env === "production" ? 10 : 30,
  message: {
    code: RESPONSE_CODE.RATE_LIMIT,
    message: "AI 请求太频繁啦，休息一下再试试",
    data: null,
  },
});

export default limiter;
