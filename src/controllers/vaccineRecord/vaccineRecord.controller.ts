// 导入模型
import VaccineRecord from "@/models/VaccineRecord";
import UserBabyRelation from "@/models/UserBabyRelation";
// 导入工具函数
import { catchAsync, Response } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取接种记录列表
export const getVaccineRecordList = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId } = req.body;
  // 判断当前用户是否有权限查看宝宝的接种记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 查询记录（按接种日期倒序）
  const result = await VaccineRecord.find({
    babyId,
  }).sort({ injectDate: -1 });
  return res.json(
    Response.success({ list: result, total: result.length }, "获取成功"),
  );
});

// 新增接种记录
export const addVaccineRecord = catchAsync(async (req, res) => {
  // 获取当前用户id
  const userId = req.user?.id;
  // 获取请求参数
  const {
    babyId,
    doseKey,
    vaccineName,
    dose,
    injectDate,
    hospital,
    batchNo,
    fee,
    note,
  } = req.body;
  // 判断当前用户是否有权限给宝宝新增接种记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 创建接种记录
  const vaccineRecord = await VaccineRecord.create({
    userId,
    babyId,
    doseKey,
    vaccineName,
    dose,
    injectDate,
    hospital,
    batchNo,
    fee,
    note,
  });
  return res.json(Response.success(vaccineRecord._id, "新增成功"));
});

// 编辑接种记录
export const editVaccineRecord = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const {
    id,
    babyId,
    doseKey,
    vaccineName,
    dose,
    injectDate,
    hospital,
    batchNo,
    fee,
    note,
  } = req.body;
  // 仅创建人可编辑（userId 匹配记录创建人）
  const vaccineRecord = await VaccineRecord.findOneAndUpdate(
    {
      _id: id,
      userId,
      babyId,
    },
    {
      $set: {
        doseKey,
        vaccineName,
        dose,
        injectDate,
        hospital,
        batchNo,
        fee,
        note,
      },
    },
  );
  if (!vaccineRecord) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "记录不存在,无法修改"),
    );
  }
  return res.json(Response.success("编辑成功"));
});

// 删除接种记录
export const deleteVaccineRecord = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取记录id
  const id = req.query.id as string;
  // 仅创建人可删除（userId 匹配记录创建人）
  const vaccineRecord = await VaccineRecord.findOneAndDelete({
    _id: id,
    userId,
  });
  if (!vaccineRecord) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "当前记录不存在，无法删除"),
    );
  }
  return res.json(Response.success(null, "删除成功"));
});
