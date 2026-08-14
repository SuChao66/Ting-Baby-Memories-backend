import { Request, Response, NextFunction } from "express";
import { TokenExpiredError } from "jsonwebtoken";
// 导入工具函数
import { Response as ApiResponse, JWT } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 权限认证中间件：校验 cookie 中的 token
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 从 cookie 中获取 token
  const token = req.cookies?.token;
  // 1.缺少 token
  if (!token) {
    return res
      .status(RESPONSE_CODE.UNAUTHORIZED)
      .json(ApiResponse.error(RESPONSE_CODE.UNAUTHORIZED, "未授权，请先登录"));
  }
  try {
    // 2.校验签名+有效期，过期抛 TokenExpiredError，无效抛 JsonWebTokenError
    req.user = JWT.verify(token);
    next();
  } catch (err) {
    // 3.区分过期与无效，便于前端精确处理
    if (err instanceof TokenExpiredError) {
      return res
        .status(RESPONSE_CODE.UNAUTHORIZED)
        .json(
          ApiResponse.error(
            RESPONSE_CODE.UNAUTHORIZED,
            "token 已过期，请重新登录",
          ),
        );
    }
    return res
      .status(RESPONSE_CODE.UNAUTHORIZED)
      .json(ApiResponse.error(RESPONSE_CODE.UNAUTHORIZED, "token 无效"));
  }
};

export default authMiddleware;
