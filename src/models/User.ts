import mongoose, { Schema } from "mongoose";

// 创建用户模型
const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String, default: null },
    nickname: { type: String, default: null },
    avatarUrl: { type: String, default: null },
    status: { type: Number, default: 1 }, // 账号状态：0-禁用 1-正常
    gender: { type: Number, default: 0 }, // 性别：0-女 1-男
    phone: { type: String, default: null }, // 手机号
    // --- 内嵌用户资料 ---
    profile: {
      birthday: { type: Date, default: null },
      height: { type: Number, default: null },
    },
  },
  { timestamps: true },
);

// 创建用户模型实例
export default mongoose.model("User", UserSchema, "user");
