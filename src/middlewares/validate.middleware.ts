import type { Request, Response, NextFunction } from "express";
// 引入 express-validator 结果验证模块
import { validationResult } from "express-validator";
// 引入响应工具模块
import { Response as ApiResponse } from "@/utils";
// 引入常量
import { RESPONSE_CODE } from "@/enums";

// 校验 express-validator 结果，有错误时按统一响应格式返回
function validateMiddleware(req: Request, res: Response, next: NextFunction) {
  // 校验 express-validator 结果
  // 如果校验通过，继续执行下一个中间件
  // 如果校验失败，返回统一响应格式
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // 校验失败，返回统一响应格式
  const message = errors
    .array()
    .map((err) => err.msg)
    .join("; ");

  return res
    .status(RESPONSE_CODE.BAD_REQUEST)
    .json(ApiResponse.error(RESPONSE_CODE.BAD_REQUEST, message));
}

export default validateMiddleware;
