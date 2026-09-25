// 导入模型
import HeightWeight from "@/models/HeightWeight";
import UserBabyRelation from "@/models/UserBabyRelation";
// 导入工具函数
import { catchAsync, Response } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取记录
export const getHeightWeightList = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId } = req.body;
  // 判断当前用户是否有权限给宝宝新增身高体重记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 查询记录（按date倒序）
  const result = await HeightWeight.find({
    babyId,
  }).sort({ date: -1 });
  return res.json(
    Response.success({ list: result, total: result.length }, "获取成功"),
  );
});

// 新增记录
export const addHeightWeight = catchAsync(async (req, res) => {
  // 获取当前用户id
  const userId = req.user?.id;
  // 获取请求参数
  const { babyId, height, weight, head, date } = req.body;
  // 判断当前用户是否有权限给宝宝新增身高体重记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 创建记录
  const heightWeight = await HeightWeight.create({
    userId,
    babyId,
    height,
    weight,
    head,
    date,
  });
  return res.json(Response.success(heightWeight._id, "新增成功"));
});

// 编辑记录
export const editHeightWeight = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const { id, height, weight, head, date, babyId } = req.body;
  // 仅创建人可编辑（userId 匹配记录创建人）
  const heightWeight = await HeightWeight.findOneAndUpdate(
    {
      _id: id,
      userId,
      babyId,
    },
    {
      $set: {
        height,
        weight,
        head,
        date,
      },
    },
  );
  if (!heightWeight) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "记录不存在,无法修改"),
    );
  }
  return res.json(Response.success("编辑成功"));
});

// 删除记录
export const deleteHeightWeight = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取记录id
  const id = req.query.id as string;
  // 仅创建人可删除（userId 匹配记录创建人）
  // 删除记录
  const heightWeight = await HeightWeight.findOneAndDelete({
    _id: id,
    userId,
  });
  if (!heightWeight) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "当前记录不存在，无法删除"),
    );
  }
  return res.json(Response.success(null, "删除成功"));
});
