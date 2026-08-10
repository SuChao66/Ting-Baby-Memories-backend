const { Response, logger } = require("../utils");
const { RESPONSE_CODE } = require("../enums");

// 全局错误处理
function errorMiddleware(err, req, res, next) {
  logger.error(err.message, {
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res
    .status(err.status || RESPONSE_CODE.SERVER_ERROR)
    .json(Response.error(err.message || "服务器内部错误", err.status || 500));
}

module.exports = errorMiddleware;
