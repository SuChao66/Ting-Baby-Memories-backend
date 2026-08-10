const Response = require("../utils").Response;

// 全局错误处理
function errorMiddleware(err, req, res, next) {
  console.error("[Error]", err.message);
  res
    .status(err.status || 500)
    .json(Response.error(err.message || "服务器内部错误", err.status || 500));
}

module.exports = errorMiddleware;
