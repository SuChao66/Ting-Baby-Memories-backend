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

// 上传文件，允许的 Content-Type 白名单
export const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mp3",
  "audio/wav",
  "audio/mpeg",
];

// 记录权限
export const TIME_LINE_VISIBLE_ROLES = {
  PUBLIC: "public", // 公开
  FAMILY: "family", // 家庭
  PRIVATE: "private", // 私有
};

// 文件类型
export const FILE_TYPE = {
  IMAGE: "img",
  VIDEO: "video",
  AUDIO: "audio",
};
