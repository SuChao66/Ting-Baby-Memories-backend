import mongoose, { Schema, Document } from "mongoose";

interface IVaccinePlan extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  /** 已加入接种计划的自费疫苗剂次 key 集合 */
  keys: string[]; // 剂次标识列表
}

// 创建模型
const vaccinePlanSchema = new Schema<IVaccinePlan>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 最近操作用户id
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    keys: { type: [String], default: [] }, // 已加入计划的自费疫苗剂次 key
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 每个宝宝仅保存一份接种计划
vaccinePlanSchema.index({ babyId: 1 }, { unique: true });

export default mongoose.model<IVaccinePlan>(
  "VaccinePlan",
  vaccinePlanSchema,
  "vaccinePlan",
);
