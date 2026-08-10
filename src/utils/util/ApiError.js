// 统一错误类，携带 HTTP 状态码，供 controller 抛出后由 errorMiddleware 统一处理
class ApiError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

module.exports = ApiError;
