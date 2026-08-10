const Timeline = require("../../models/Timeline");
// 引入 code 值
const { RESPONSE_CODE } = require("../../enums");
// 引入工具函数
const { Response, ApiError, catchAsync } = require("../../utils");

// 获取时间线列表
exports.getTimelineList = catchAsync(async (req, res) => {
  const list = await Timeline.find().sort({ date: -1 });
  res.json(Response.success(list));
});

// 新增时间线项
exports.addTimelineItem = catchAsync(async (req, res) => {
  const { title, description, date } = req.body;
  const item = await Timeline.create({ title, description, date });
  res.json(Response.success(item));
});

// 删除时间线项
exports.deleteTimelineItem = catchAsync(async (req, res) => {
  const { id } = req.params;
  const item = await Timeline.findByIdAndDelete(id);
  if (!item) {
    throw new ApiError("时间线项不存在", RESPONSE_CODE.NOT_FOUND);
  }
  res.json(Response.success(null));
});
