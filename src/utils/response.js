// 统一响应结构，与前端 ApiResponse 对齐
// { code: 0, message: "success", data: T }
class Response {
  static success(data = null, message = "success") {
    return { code: 0, message, data };
  }

  static error(message = "error", code = 500) {
    return { code, message, data: null };
  }
}

module.exports = Response;
