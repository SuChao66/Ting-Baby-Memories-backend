import type { JwtPayload } from "jsonwebtoken";

// 扩展 Express Request，增加项目自定义字段
declare module "express" {
  interface Request {
    id?: string;
    user?: string | JwtPayload;
  }
}
