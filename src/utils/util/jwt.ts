import jwt from "jsonwebtoken";
import config from "@/config";

// 签发 JWT
const sign = (payload: string | object | Buffer): string =>
  jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.expiresIn,
  } as jwt.SignOptions);

// 验证 JWT
const verify = (token: string): string | jwt.JwtPayload =>
  jwt.verify(token, config.jwtSecret);

export { sign, verify };
