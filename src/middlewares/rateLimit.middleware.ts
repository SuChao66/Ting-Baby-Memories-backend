// 速率限制中间件
import rateLimit from "express-rate-limit";
import config from "@/config";
import { RESPONSE_CODE } from "@/enums";

// 速率限制中间件
const limiter = rateLimit({
  windowMs: config.WINDOW_MS, // 15 分钟窗口
  max: config.MAX, // 每个 IP 最多 100 次请求
  message: {
    code: RESPONSE_CODE.RATE_LIMIT,
    message: config.MESSAGE,
    data: null,
  },
});

export default limiter;
