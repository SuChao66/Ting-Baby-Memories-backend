import type { Request, Response, NextFunction, RequestHandler } from "express";

type AsyncHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<void>;

// 异步错误捕获包装器，消除 controller 中重复的 try/catch 模板
function catchAsync(fn: AsyncHandler): RequestHandler {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

export default catchAsync;
