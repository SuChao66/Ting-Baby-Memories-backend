import mongoose, { Schema, Document } from "mongoose";
// 导入常量
import {
  DAILY_RECORD_TYPES,
  DIAPER_STATUS,
  BREAST_FEED_MODE,
  BREAST_SIDE,
  POOP_COLOR_OPTIONS,
  POOP_SHAPE_OPTIONS,
  PEE_AMOUNT_OPTIONS,
} from "@/enums";

/** 吃喝拉撒睡类型 */
export type DailyRecordType =
  (typeof DAILY_RECORD_TYPES)[keyof typeof DAILY_RECORD_TYPES];

interface IDailyRecord extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  type: DailyRecordType; // 记录类型
  /** 公共记录 */
  startTime?: Date; // 开始时间
  remark?: string; // 评价
  /** 洗澡、睡眠、玩耍、游泳、其他事件 */
  duration?: number; // 持续时间
  /** 其他事件 */
  eventName?: string; // 其他事件名称
  /** 辅食 */
  foodName?: string; // 辅食名称
  foodWeight?: string; // 辅食重量
  /** 换尿布 */
  status?: string; // 尿布状态
  poopColor?: string; // 臭臭颜色
  poopShape?: string; // 臭臭形状
  peeAmount?: string; // 尿量
  hasRash?: boolean; // 是否红屁股
  /** 喂奶 */
  // 亲喂
  breastMode?: string; // 亲喂模式：计时 / 手动输入
  leftDuration?: number; // 左侧喂时间 分钟
  rightDuration?: number; // 右侧喂时间 分钟
  lastUsedSide?: string; // 上一次喂的是左侧还是右侧
  estimatedAmount?: number; // 预估奶量 ml
  // 瓶喂
  formulaAmount?: number; // 配方奶 ml
  breastMilkAmount?: number; // 母乳 ml
}

// 创建模型
const dailyRecordSchema = new Schema<IDailyRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户id
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    type: { type: String, enum: DAILY_RECORD_TYPES, required: true }, // 记录类型
    /** 公共记录 */
    startTime: { type: Date }, // 开始时间
    remark: { type: String }, // 评价
    /** 洗澡、睡眠、玩耍、游泳、其他事件 */
    duration: { type: Number }, // 持续时间
    /** 其他事件 */
    eventName: { type: String }, // 其他事件名称
    /** 辅食 */
    foodName: { type: String }, // 辅食名称
    foodWeight: { type: String }, // 辅食重量
    /** 换尿布 */
    status: { type: String, enum: DIAPER_STATUS }, // 尿布状态
    poopColor: { type: String, enum: POOP_COLOR_OPTIONS }, // 臭臭颜色
    poopShape: { type: String, enum: POOP_SHAPE_OPTIONS }, // 臭臭形状
    peeAmount: { type: String, enum: PEE_AMOUNT_OPTIONS }, // 尿量
    hasRash: { type: Boolean }, // 是否红屁股
    /** 喂奶 */
    // 亲喂
    breastMode: { type: String, enum: BREAST_FEED_MODE }, // 亲喂模式：计时 / 手动输入
    leftDuration: { type: Number }, // 左侧喂时间 分钟
    rightDuration: { type: Number }, // 右侧喂时间 分钟
    lastUsedSide: { type: String, enum: BREAST_SIDE }, // 上一次喂的是左侧还是右侧
    estimatedAmount: { type: Number }, // 预估奶量 ml
    // 瓶喂
    formulaAmount: { type: Number }, // 配方奶 ml
    breastMilkAmount: { type: Number }, // 母乳 ml
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 按babyId查询某个宝宝的记录，并按startTime倒序排列
dailyRecordSchema.index({ babyId: 1, startTime: -1 });

export default mongoose.model<IDailyRecord>(
  "DailyRecord",
  dailyRecordSchema,
  "dailyRecord",
);
