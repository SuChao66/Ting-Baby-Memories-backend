const mongoose = require("mongoose");

// 创建模型
const timelineSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }, // 自动添加 createdAt 和 updatedAt 字段
);

module.exports = mongoose.model("Timeline", timelineSchema, 'timeline');
