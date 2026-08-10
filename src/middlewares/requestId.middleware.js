// 请求 ID 追踪中间件，为每次请求生成唯一 ID，串联完整调用链路
const crypto = require("crypto");

// 请求 ID 追踪中间件
function requestIdMiddleware(req, res, next) {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
}

module.exports = requestIdMiddleware;
