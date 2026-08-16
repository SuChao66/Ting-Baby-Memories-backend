import type { JwtPayload } from "jsonwebtoken";

// token 载荷类型（与 JWT.sign 传入的字段保持一致）
export interface TokenPayload extends JwtPayload {
  id: string;
  username: string;
}

// 扩展 Express Request，增加项目自定义字段
declare module "express" {
  interface Request {
    id?: string;
    user?: TokenPayload;
  }
}
