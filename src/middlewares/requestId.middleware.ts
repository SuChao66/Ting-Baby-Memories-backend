// 请求 ID 追踪中间件，为每次请求生成唯一 ID，串联完整调用链路
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";

// 请求 ID 追踪中间件
function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  req.id = crypto.randomUUID();
  res.setHeader("X-Request-Id", req.id);
  next();
}

export default requestIdMiddleware;
