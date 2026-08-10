// 引入 code 值
const { RESPONSE_CODE } = require("../../enums");

// 统一响应结构，与前端 ApiResponse 对齐
// { code: 0, message: "success", data: T }
class Response {
  static success(data = null, message = "success") {
    return { code: RESPONSE_CODE.SUCCESS, message, data };
  }

  static error(message = "error", code = RESPONSE_CODE.SERVER_ERROR) {
    return { code, message, data: null };
  }
}

module.exports = Response;
