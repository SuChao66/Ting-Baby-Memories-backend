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

/** 吃喝拉撒睡类型 */
export const DAILY_RECORD_TYPES = {
  /** 喂奶 */
  FEED: "feed",
  /** 睡眠 */
  SLEEP: "sleep",
  /** 换尿布 */
  DIAPER: "diaper",
  /** 辅食 */
  FOOD: "food",
  /** 洗澡 */
  BATH: "bath",
  /** 玩耍 */
  PLAY: "play",
  /** 游泳 */
  SWIM: "swim",
  /** 其他事件 */
  OTHER: "other",
} as const;

/** 尿布状态：臭臭 / 嘘嘘 / 臭臭+嘘嘘 / 干爽 */
export const DIAPER_STATUS = {
  POOP: "poop", // 臭臭
  PEE: "pee", // 嘘嘘
  BOTH: "both", // 臭臭+嘘嘘
  DRY: "dry", // 干爽
} as const;

/** 喂奶方式 */
export const FEED_METHOD = {
  BREAST: "breast", // 亲喂
  BOTTLE: "bottle", // 瓶喂
} as const;

/** 亲喂模式 */
export const BREAST_FEED_MODE = {
  TIMER: "timer", // 计时
  MANUAL: "manual", // 手动输入
} as const;

/** 亲喂左右侧 */
export const BREAST_SIDE = {
  LEFT: "left",
  RIGHT: "right",
} as const;

/** 瓶喂奶类型 */
export const BOTTLE_MILK_TYPE = {
  FORMULA: "formula", // 配方奶
  BREAST_MILK: "breastMilk", // 母乳
} as const;

/** 臭臭颜色选项 */
export const POOP_COLOR_OPTIONS = [
  "yellow",
  "yellowGreen",
  "darkGreen",
  "greenBrown",
  "lightYellow",
  "darkBrown",
  "black",
  "green",
  "grayWhite",
  "darkRed",
  "red",
  "pink",
] as const;

/** 臭臭形状 */
export const POOP_SHAPE_OPTIONS = [
  "paste",
  "dryThick",
  "cream",
  "milkCurds",
  "watery",
  "foamy",
  "muddy",
  "granular",
  "tarry",
  "jam",
  "tofuResidue",
  "eggDropSoup",
  "mucus",
  "asphaltLike",
  "powder",
] as const;

/** 尿量选项 */
export const PEE_AMOUNT_OPTIONS = ["little", "medium", "much"] as const;
