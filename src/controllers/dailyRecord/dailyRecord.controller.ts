// 导入模型
import DailyRecord from "@/models/DailyRecord";
import UserBabyRelation from "@/models/UserBabyRelation";
// 导入工具函数
import { catchAsync, Response } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取记录
export const getDailyRecordList = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId, date, type } = req.body;
  // 判断当前用户是否有权限给宝宝新增日常生活记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 应用面向国内用户，统一按北京时间（UTC+8）切分一天：[date 00:00, 次日 00:00)
  const [y, m, d] = date.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(y, m - 1, d));
  const endOfDay = new Date(Date.UTC(y, m - 1, d + 1));
  // 查询记录：type 为空查全部，否则按类型筛选
  const result = await DailyRecord.find({
    babyId,
    startTime: {
      $lt: endOfDay,
      $gte: startOfDay,
    },
    ...(type !== undefined ? { type } : {}),
  }).sort({ startTime: -1 });
  return res.json(
    Response.success({ list: result, total: result.length }, "获取成功"),
  );
});

// 新增记录
export const addDailyRecord = catchAsync(async (req, res) => {
  // 获取当前用户id
  const userId = req.user?.id;
  // 获取请求参数
  const {
    babyId,
    type,
    startTime,
    remark,
    duration,
    eventName,
    foodName,
    foodWeight,
    status,
    poopColor,
    poopShape,
    peeAmount,
    hasRash,
    breastMode,
    leftDuration,
    rightDuration,
    lastUsedSide,
    estimatedAmount,
    formulaAmount,
    breastMilkAmount,
  } = req.body;
  // 判断当前用户是否有权限给宝宝新增日常生活记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 创建日常生活记录
  const dailyRecord = await DailyRecord.create({
    userId,
    babyId,
    type,
    startTime,
    remark,
    duration,
    eventName,
    foodName,
    foodWeight,
    status,
    poopColor,
    poopShape,
    peeAmount,
    hasRash,
    breastMode,
    leftDuration,
    rightDuration,
    lastUsedSide,
    estimatedAmount,
    formulaAmount,
    breastMilkAmount,
  });
  return res.json(Response.success(dailyRecord._id, "新增成功"));
});

// 编辑记录
export const editDailyRecord = catchAsync(async (req, res) => {
  return res.json(Response.success("编辑成功"));
});

// 删除记录
export const deleteDailyRecord = catchAsync(async (req, res) => {
  return res.json(Response.success("删除成功"));
});
