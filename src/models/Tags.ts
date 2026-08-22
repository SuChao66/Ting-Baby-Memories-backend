import mongoose, { Schema, Document } from "mongoose";

interface ITag extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
}

// 标签模型
const tagSchema = new Schema<ITag>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户ID
    name: { type: String, required: true }, // 标签名称
  },
  { timestamps: true },
);

tagSchema.index({ userId: 1, name: 1 }, { unique: true });

export default mongoose.model("Tags", tagSchema, "tags");
