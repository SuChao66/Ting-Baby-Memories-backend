import mongoose, { Schema, Document } from "mongoose";

interface IHeightWeight extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  height: number;
  weight: number;
  head?: number;
  date: Date;
}

// 创建模型
const heightWeightSchema = new Schema<IHeightWeight>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户id
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    head: { type: Number },
    date: { type: Date, required: true },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 按babyId查询某个宝宝的记录，并按date倒序排列
heightWeightSchema.index({ babyId: 1, date: -1 });

export default mongoose.model<IHeightWeight>(
  "HeightWeight",
  heightWeightSchema,
  "heightWeight",
);
