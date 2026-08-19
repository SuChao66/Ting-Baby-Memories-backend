import mongoose, { Schema, Document } from "mongoose";

export interface IBabyProfile {
  bloodType: string | null;
  birthWeight: number | null;
  birthHeight: number | null;
  allergens: string | null;
  preferences: string | null;
  remarks: string | null;
}

export interface IBaby extends Document {
  nickname: string;
  avatarUrl: string | null;
  gender: 0 | 1;
  birthday: Date;
  birthTime: string | null;
  creatorId: mongoose.Types.ObjectId;
  profile: IBabyProfile;
}

// 创建模型
const babySchema = new Schema<IBaby>(
  {
    nickname: { type: String, required: true }, // 宝宝小名
    avatarUrl: { type: String, default: null }, // 宝宝头像URL
    gender: { type: Number, required: true, enum: [0, 1] }, // 性别：0-女 1-男
    birthday: { type: Date, required: true }, // 出生日期
    birthTime: { type: String, default: null }, // 出生时刻（HH:mm:ss）
    creatorId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 创建者用户ID

    // --- 内嵌宝宝档案（原 baby_profiles 表） ---
    profile: {
      bloodType: { type: String, default: null }, // 血型（A/B/O/AB/Rh等）
      birthWeight: { type: Number, default: null }, // 出生体重（kg）
      birthHeight: { type: Number, default: null }, // 出生身长（cm）
      allergens: { type: String, default: null }, // 过敏原
      preferences: { type: String, default: null }, // 喜好
      remarks: { type: String, default: null }, // 备注
    },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

babySchema.index({ creatorId: 1 });

export default mongoose.model<IBaby>("Baby", babySchema, "baby");
