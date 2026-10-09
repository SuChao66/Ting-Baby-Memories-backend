import mongoose, { Schema, Document } from "mongoose";

interface IFutureMessageRead extends Document {
  messageId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

// 定义未来消息已读记录模型
const FutureMessageReadSchema = new Schema<IFutureMessageRead>(
  {
    messageId: {
      type: Schema.Types.ObjectId,
      ref: "FutureMessage",
      required: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

FutureMessageReadSchema.index({ userId: 1, messageId: 1 }, { unique: true });

export default mongoose.model<IFutureMessageRead>(
  "FutureMessageRead",
  FutureMessageReadSchema,
  "future_message_read",
);
