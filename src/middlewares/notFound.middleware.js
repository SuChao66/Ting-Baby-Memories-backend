const Response = require("../utils/response");

// 404 处理
function notFoundMiddleware(req, res) {
  res.status(404).json(Response.error("接口不存在", 404));
}

module.exports = notFoundMiddleware;
