import mongoose, { Schema, Document } from "mongoose";

// 文件
interface IFile {
  url: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  fileName: string;
}

export interface IFutureMessage extends Document {
  userId: mongoose.Types.ObjectId;
  babyId: mongoose.Types.ObjectId;
  content: string;
  revealDate: Date; // 解锁日期
  files?: Array<IFile>; // 图片、视频、音频
  visibleRoles: string; // 可见角色
}

// FutureMessage 模型
const futureMessageSchema = new Schema<IFutureMessage>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // 关联用户ID
    babyId: { type: Schema.Types.ObjectId, ref: "Baby", required: true }, // 关联宝宝ID
    content: { type: String, required: true }, // 未来寄语内容
    revealDate: { type: Date, required: true }, // 解锁日期
    files: {
      type: [
        {
          url: { type: String, required: true },
          type: {
            type: String,
            enum: ["IMAGE", "VIDEO", "AUDIO"],
            required: true,
          },
          fileName: { type: String, required: true },
        },
      ],
      default: [],
    }, // 图片、视频、音频
    visibleRoles: {
      type: String,
      enum: ["public", "family", "private"],
      default: "family",
    }, // 可见角色
  },
  { timestamps: true },
);

// 按babyId查询某个宝宝的寄语，并按解锁日期升序排列
futureMessageSchema.index({ babyId: 1, revealDate: 1 });
// 按userId查询某用户写的寄语
futureMessageSchema.index({ userId: 1 });
// 按解锁日期扫描到期记录（解锁判断/到期推送）
futureMessageSchema.index({ revealDate: 1 });

export default mongoose.model<IFutureMessage>(
  "FutureMessage",
  futureMessageSchema,
  "futureMessages",
);
