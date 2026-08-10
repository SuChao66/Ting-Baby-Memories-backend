const { Response } = require("../utils");
const { RESPONSE_CODE } = require("../enums");

// 404 处理
function notFoundMiddleware(req, res) {
  res
    .status(RESPONSE_CODE.NOT_FOUND_ERROR)
    .json(Response.error("接口不存在", RESPONSE_CODE.NOT_FOUND_ERROR));
}

module.exports = notFoundMiddleware;
