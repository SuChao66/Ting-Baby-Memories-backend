import { RESPONSE_CODE } from "@/enums";

// 统一响应结构，与前端 ApiResponse 对齐
// { code: 0, message: "success", data: T }
interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T | null;
}

class Response {
  static success<T = unknown>(
    data: T = null as T,
    message: string = "success",
  ): ApiResponse<T> {
    return { code: RESPONSE_CODE.SUCCESS, message, data };
  }

  static error(
    code: number = RESPONSE_CODE.SERVER_ERROR,
    message: string = "error",
  ): ApiResponse<null> {
    return { code, message, data: null };
  }
}

export default Response;
