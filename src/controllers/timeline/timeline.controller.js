const Timeline = require("../../models/Timeline");
const Response = require("../../utils/response");

// 获取时间线列表
exports.getTimelineList = async (req, res, next) => {
  try {
    const list = await Timeline.find().sort({ date: -1 });
    res.json(Response.success(list));
  } catch (err) {
    next(err);
  }
};

// 新增时间线项
exports.addTimelineItem = async (req, res, next) => {
  try {
    const { title, description, date } = req.body;
    const item = await Timeline.create({ title, description, date });
    res.json(Response.success(item));
  } catch (err) {
    next(err);
  }
};

// 删除时间线项
exports.deleteTimelineItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = await Timeline.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json(Response.error("时间线项不存在", 404));
    }
    res.json(Response.success(null));
  } catch (err) {
    next(err);
  }
};
