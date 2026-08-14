import { Request, Response, NextFunction } from "express";
import { Response as ApiResponse, logger } from "@/utils";
import { RESPONSE_CODE } from "@/enums";

// 全局错误处理
function errorMiddleware(
  err: Error & { status?: number },
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  logger.error(err.message, {
    requestId: req.id,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  res
    .status(err.status || RESPONSE_CODE.SERVER_ERROR)
    .json(
      ApiResponse.error(
        err.status || RESPONSE_CODE.SERVER_ERROR,
        err.message || "服务器内部错误",
      ),
    );
}

export default errorMiddleware;
