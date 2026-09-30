import { randomBytes } from "crypto";

/**
 * 生成邀请链接 token
 * 使用 crypto.randomBytes 生成 32 位十六进制随机串（128 位熵），
 * 加密安全、不可预测、不可枚举，适合作为"知道即可绑定"的邀请凭证
 */
export function generateInviteLinkToken(): string {
  return randomBytes(16).toString("hex");
}
