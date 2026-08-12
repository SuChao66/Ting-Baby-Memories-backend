import { Request, Response, NextFunction } from "express";
import { Response as ApiResponse, JWT } from "@/utils";

// 权限认证中间件
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(ApiResponse.error("未授权，请先登录", 401));
  }
  try {
    const token = authHeader.split(" ")[1]!;
    req.user = JWT.verify(token);
    next();
  } catch {
    return res.status(401).json(ApiResponse.error("token 无效或已过期", 401));
  }
};

export default authMiddleware;
