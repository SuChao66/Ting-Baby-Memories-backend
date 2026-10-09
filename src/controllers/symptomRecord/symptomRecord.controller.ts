// 导入模型
import SymptomRecord from "@/models/SymptomRecord";
import UserBabyRelation from "@/models/UserBabyRelation";
// 导入工具函数
import { catchAsync, Response } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取记录
export const getSymptomRecordList = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId, date, type } = req.body;
  // 判断当前用户是否有权限查看宝宝的症状护理记录（status: 1-正常，0-已移除）
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
  const result = await SymptomRecord.find({
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
export const addSymptomRecord = catchAsync(async (req, res) => {
  // 获取当前用户id
  const userId = req.user?.id;
  // 获取请求参数
  const {
    babyId,
    type,
    startTime,
    remark,
    temperature,
    symptoms,
    medicineType,
    medicineName,
    dosage,
    hospital,
    department,
    doctor,
    diagnosis,
    advice,
    content,
  } = req.body;
  // 判断当前用户是否有权限给宝宝新增症状护理记录（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 创建症状护理记录
  const symptomRecord = await SymptomRecord.create({
    userId,
    babyId,
    type,
    startTime,
    remark,
    temperature,
    symptoms,
    medicineType,
    medicineName,
    dosage,
    hospital,
    department,
    doctor,
    diagnosis,
    advice,
    content,
  });
  return res.json(Response.success(symptomRecord._id, "新增成功"));
});

// 编辑记录
export const editSymptomRecord = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const {
    id,
    babyId,
    startTime,
    remark,
    temperature,
    symptoms,
    medicineType,
    medicineName,
    dosage,
    hospital,
    department,
    doctor,
    diagnosis,
    advice,
    content,
  } = req.body;
  // 仅创建人可编辑（userId 匹配记录创建人）
  const symptomRecord = await SymptomRecord.findOneAndUpdate(
    {
      _id: id,
      userId,
      babyId,
    },
    {
      $set: {
        startTime,
        remark,
        temperature,
        symptoms,
        medicineType,
        medicineName,
        dosage,
        hospital,
        department,
        doctor,
        diagnosis,
        advice,
        content,
      },
    },
  );
  if (!symptomRecord) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "记录不存在,无法修改"),
    );
  }
  return res.json(Response.success("编辑成功"));
});

// 删除记录
export const deleteSymptomRecord = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取记录id
  const id = req.query.id as string;
  // 仅创建人可删除（userId 匹配记录创建人）
  // 删除记录
  const symptomRecord = await SymptomRecord.findOneAndDelete({
    _id: id,
    userId,
  });
  if (!symptomRecord) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "当前记录不存在，无法删除"),
    );
  }
  return res.json(Response.success(null, "删除成功"));
});
