import mongoose, { Schema, Document } from "mongoose";

// 用户与宝宝关系模型
export interface IUserBabyRelation extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  relation: "mother" | "father" | "grandparent" | "other";
  role: "admin" | "observer";
  visitCount: number;
  lastVisitAt: Date | null;
  status: 0 | 1;
}

// 用户 <-> 宝宝关系
const userBabyRelationSchema = new Schema<IUserBabyRelation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 用户ID
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 宝宝ID
    relation: {
      type: String,
      enum: ["mother", "father", "grandparent", "other"],
      required: true,
    }, // 与宝宝关系：mother/father/grandparent/other
    role: { type: String, default: "observer", enum: ["admin", "observer"] }, // 角色：admin-管理员 observer-观察者
    visitCount: { type: Number, default: 0 }, // 来访次数
    lastVisitAt: { type: Date, default: null }, // 最近访问时间
    status: { type: Number, default: 1, enum: [0, 1] }, // 状态：0-已移除 1-正常
  },
  { timestamps: true },
);

userBabyRelationSchema.index({ userId: 1, babyId: 1 }, { unique: true });
userBabyRelationSchema.index({ babyId: 1 });

export default mongoose.model(
  "UserBabyRelation",
  userBabyRelationSchema,
  "user_baby_relation",
);
