// 统一错误类，携带 HTTP 状态码，供 controller 抛出后由 errorMiddleware 统一处理
class ApiError extends Error {
  status: number;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

export default ApiError;
