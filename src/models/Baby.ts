import mongoose, { Schema, Document } from "mongoose";

export interface IBaby extends Document {
  name: string;
  birthday: string;
  avatar: string;
}

// 创建模型
const babySchema = new Schema<IBaby>(
  {
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

export default mongoose.model<IBaby>("Baby", babySchema, "baby");
