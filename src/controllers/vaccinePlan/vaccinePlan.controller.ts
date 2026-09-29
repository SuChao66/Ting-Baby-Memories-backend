// 导入模型
import VaccinePlan from "@/models/VaccinePlan";
import UserBabyRelation from "@/models/UserBabyRelation";
// 导入工具函数
import { catchAsync, Response } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取接种计划
export const getVaccinePlan = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId } = req.body;
  // 判断当前用户是否有权限查看宝宝的接种计划（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 查询接种计划（每个宝宝仅一份，无记录时返回空集合）
  const plan = await VaccinePlan.findOne({ babyId });
  return res.json(Response.success({ keys: plan?.keys ?? [] }, "获取成功"));
});

// 保存接种计划（整份覆盖）
export const saveVaccinePlan = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId, keys } = req.body;
  // 判断当前用户是否有权限保存宝宝的接种计划（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 按宝宝维度 upsert，整份覆盖剂次 key 集合
  await VaccinePlan.findOneAndUpdate(
    { babyId },
    { $set: { userId, keys } },
    { upsert: true },
  );
  return res.json(Response.success("保存成功"));
});
