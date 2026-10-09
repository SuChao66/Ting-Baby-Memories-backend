import mongoose, { Schema, Document } from "mongoose";

// 宝宝邀请模型
// 一次邀请动作生成一条记录（含随机 token），被邀请人通过链接中的 token 完成绑定
export interface IBabyInvite extends Document {
  babyId: mongoose.Types.ObjectId;
  inviterId: mongoose.Types.ObjectId;
  relation: "mother" | "father" | "grandparent" | "other";
  role?: "admin" | "observer";
  token: string;
  maxUses: number;
  usedCount: number;
  expiresAt: Date;
  status: 0 | 1;
}

const babyInviteSchema = new Schema<IBabyInvite>(
  {
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true },
    inviterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    relation: {
      type: String,
      required: true,
      enum: ["mother", "father", "grandparent", "other"],
    }, // 被邀请人与宝宝的关系
    role: { type: String, default: "observer", enum: ["admin", "observer"] }, // 角色：admin-管理员 observer-观察者（默认最小权限）
    token: { type: String, required: true }, // 邀请凭证：crypto.randomBytes(16) 生成的 32 位十六进制随机串
    maxUses: { type: Number, default: 1 }, // 链接最多可被使用次数
    usedCount: { type: Number, default: 0 }, // 已被使用次数
    expiresAt: { type: Date, required: true }, // 过期时间（默认邀请后 7 天）
    status: { type: Number, default: 1, enum: [0, 1] }, // 状态：0-已作废 1-有效
  },
  { timestamps: true },
);

// token 唯一索引（链接反查邀请记录的主入口）
babyInviteSchema.index({ token: 1 }, { unique: true });
// 过期兜底清理：过期 30 天后由 MongoDB TTL 自动删除
// 注意：过期判断以查询时校验 expiresAt 为准（用于区分"已过期"与"无效"），TTL 仅做数据清理
babyInviteSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 },
);

export default mongoose.model<IBabyInvite>(
  "BabyInvite",
  babyInviteSchema,
  "baby_invite",
);
