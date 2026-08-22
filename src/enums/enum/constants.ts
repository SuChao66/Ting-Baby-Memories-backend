// 统一管理 code 值，避免分散硬编码。
export const RESPONSE_CODE = {
  SUCCESS: 0,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  RATE_LIMIT: 429,
  PARAM_ERROR: 430,
  SERVER_ERROR: 500,
} as const;

/** 密码强度校验正则表达式 */
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{6,}$/;

export type ResponseCode = (typeof RESPONSE_CODE)[keyof typeof RESPONSE_CODE];

// 上传图片，允许的 Content-Type 白名单
export const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];
