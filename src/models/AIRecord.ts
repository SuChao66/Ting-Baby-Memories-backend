import mongoose, { Schema, Document } from "mongoose";

interface IAIRecord extends Document {
  userId: mongoose.Types.ObjectId;
  sessionCode: string;
  reqId: string;
  question: string;
  answer: string;
  status: 1 | 0; // 1-成功 0-失败
  createdAt: Date; // 问答时间（timestamps 自动生成）
  updatedAt: Date;
}

// AI问答记录模型
const AIRecordSchema = new Schema<IAIRecord>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户ID
    sessionCode: { type: String, required: true }, // 会话编码，同一会话的问答归为一组
    reqId: { type: String, required: true }, // 请求唯一标识，用于幂等去重
    question: { type: String, required: true }, // 用户问题
    answer: { type: String, required: true }, // AI回答
    status: { type: Number, enum: [1, 0], required: true }, // 问答状态
  },
  { timestamps: true },
);

// 查询某用户某会话的问答记录（按时间倒序）
AIRecordSchema.index({ userId: 1, sessionCode: 1, createdAt: -1 });
// reqId 唯一，防止同一次请求重复落库
AIRecordSchema.index({ reqId: 1 }, { unique: true });

export default mongoose.model("AIRecord", AIRecordSchema, "aiRecord");
