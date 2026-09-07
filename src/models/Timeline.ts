import mongoose, { Schema, Document } from "mongoose";

// 用户信息
interface IUserInfo {
  nickname: string;
  avatarUrl: string;
  releation: string;
}

// 评论
interface IComment {
  userId: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  userInfo: IUserInfo;
}

// 文件
interface IFile {
  url: string;
  type: "IMAGE" | "VIDEO" | "AUDIO";
  fileName: string;
}

export interface ITimeline extends Document {
  userId: Schema.Types.ObjectId; // 发布者
  babyId: Schema.Types.ObjectId; // 关联宝宝
  content: string; // 内容
  comments?: Array<IComment>; // 评论
  files?: Array<IFile>; // 图片、视频、音频
  tags?: Array<string>; // 标签
  isMilestone?: boolean; // 是否里程碑事件
  publishTime: Date; // 发布时间
  visibleRoles: string; // 可见角色
}

// 创建模型
const timelineSchema = new Schema<ITimeline>(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    babyId: { type: Schema.Types.ObjectId, required: true, ref: "Baby" },
    content: { type: String, required: true },
    comments: {
      type: [
        {
          userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
          content: { type: String, required: true },
          userInfo: { type: Object },
          createdAt: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },
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
    },
    tags: { type: [{ type: String }], default: [] },
    isMilestone: { type: Boolean, default: false },
    publishTime: { type: Date, required: true },
    visibleRoles: {
      type: String,
      enum: ["public", "family", "private"],
      default: "family",
    },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

// 按babyId查询某个宝宝的所有动态，并按publishTime倒序排列
timelineSchema.index({ babyId: 1, publishTime: -1 });
// 按userId查询某用户发布的动态
timelineSchema.index({ userId: 1 });

export default mongoose.model<ITimeline>(
  "Timeline",
  timelineSchema,
  "timeline",
);
