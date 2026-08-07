const mongoose = require("mongoose");

// 创建模型
const babySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    birthday: { type: String, required: true },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

module.exports = mongoose.model("Baby", babySchema, 'baby');
