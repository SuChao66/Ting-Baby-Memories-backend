import mongoose, { Schema, Document } from "mongoose";

export interface ITimeline extends Document {
  title: string;
  description: string;
  date: string;
}

// 创建模型
const timelineSchema = new Schema<ITimeline>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

export default mongoose.model<ITimeline>(
  "Timeline",
  timelineSchema,
  "timeline",
);
