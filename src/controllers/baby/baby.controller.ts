import mongoose from "mongoose";
// 导入模型
import Baby from "@/models/Baby";
import UserBabyRelation from "@/models/UserBabyRelation";
import Timeline from "@/models/Timeline";
// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 判断当前用户是否添加了宝宝
export const getHasBabyStatus = catchAsync(async (req, res) => {
  // 获取当前用户id
  const userId = req.user!.id;
  // 通过用户与宝宝关系表查询宝宝列表（按最近访问时间倒序）
  const releations = await UserBabyRelation.find({
    userId,
    status: 1,
  });
  res.json(Response.success(releations.length > 0 ? true : false));
});

// 获取宝宝列表
export const getBabyList = catchAsync(async (req, res) => {
  const userId = req.user?.id || "";
  // 通过用户与宝宝关系表查询宝宝列表（按最近访问时间倒序）
  const relations = await UserBabyRelation.find({
    userId,
    status: 1,
  })
    .populate("babyId")
    .sort({ lastVisitAt: -1, createdAt: -1 })
    .lean();
  // 过滤掉宝宝已被删除的空数据，并拼接关系信息
  const babyList = relations
    .filter((r) => r.babyId)
    .map((r) => ({
      ...(r.babyId as object),
      relation: r.relation, // 用户和宝宝的关系
      role: r.role, // 用户的角色
    }));
  console.log("babyList", babyList);
  // 获取对应宝宝的记录数（聚合管道，一次查询拿到所有）
  const counts = await Timeline.aggregate([
    {
      $match: {
        babyId: { $in: babyList.map((b: any) => b._id) },
        $or: [
          { visibleRoles: { $in: ["public", "family"] } },
          {
            visibleRoles: "private",
            userId: new mongoose.Types.ObjectId(userId),
          },
        ],
      },
    },
    {
      $group: {
        _id: "$babyId",
        count: { $sum: 1 },
      },
    },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  console.log(countMap);
  babyList.forEach((baby: any) => {
    baby.record_count = countMap.get(String(baby._id)) || 0;
  });

  res.json(Response.success(babyList));
});

// 新增宝宝
export const addBaby = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const {
    nickname,
    avatarUrl,
    gender,
    birthday,
    birthTime,
    bloodType,
    birthWeight,
    birthHeight,
    allergens,
    preferences,
    remarks,
    relation,
  } = req.body;
  const baby = new Baby({
    creatorId: userId,
    nickname,
    avatarUrl,
    gender,
    birthday,
    birthTime,
    profile: {
      bloodType,
      birthWeight,
      birthHeight,
      allergens,
      preferences,
      remarks,
    },
  });
  // 创建宝宝
  await baby.save();
  // 创建用户与宝宝的关系记录（创建者默认为管理员角色）
  await UserBabyRelation.create({
    userId,
    babyId: baby._id,
    relation: relation || "other",
    role: "admin",
  });
  res.json(Response.success(null, "新增成功"));
});

// 获取宝宝信息（单条记录）
export const getBabyInfo = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { id } = req.query;
  const relations = await UserBabyRelation.find({
    userId,
    status: 1,
  })
    .populate("babyId")
    .sort({ lastVisitAt: -1, createdAt: -1 })
    .lean();
  const babyList = relations
    .filter((r) => r.babyId)
    .map((r) => ({
      ...(r.babyId as object),
      relation: r.relation, // 用户和宝宝的关系
      role: r.role, // 用户的角色
    }));
  const baby = babyList.find((item: any) => String(item._id) === id);
  if (!baby) {
    res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "未获取到宝宝信息"));
  }
  res.json(Response.success(baby));
});

// 更新宝宝信息
export const updateBabyInfo = catchAsync(async (req, res) => {
  const {
    id,
    nickname,
    avatarUrl,
    gender,
    birthday,
    birthTime,
    bloodType,
    birthWeight,
    birthHeight,
    allergens,
    preferences,
    remarks,
    relation,
  } = req.body;
  const baby = await Baby.findById(id);
  if (!baby) {
    res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "未获取到宝宝信息"));
    return;
  }
  if (nickname !== undefined) baby.nickname = nickname;
  if (avatarUrl !== undefined) baby.avatarUrl = avatarUrl;
  if (gender !== undefined) baby.gender = gender;
  if (birthday !== undefined) baby.birthday = birthday;
  if (birthTime !== undefined) baby.birthTime = birthTime;
  // profile 字段更新
  const profile =
    baby.profile ||
    (baby.profile = {
      bloodType: null,
      birthWeight: null,
      birthHeight: null,
      allergens: null,
      preferences: null,
      remarks: null,
    });
  if (bloodType !== undefined) profile.bloodType = bloodType;
  if (birthWeight !== undefined) profile.birthWeight = birthWeight;
  if (birthHeight !== undefined) profile.birthHeight = birthHeight;
  if (allergens !== undefined) profile.allergens = allergens;
  if (preferences !== undefined) profile.preferences = preferences;
  if (remarks !== undefined) profile.remarks = remarks;
  await baby.save();

  // 更新用户与宝宝的关系
  if (relation !== undefined) {
    await UserBabyRelation.updateOne(
      { babyId: id, userId: req.user!.id },
      { relation },
    );
  }

  res.json(Response.success(baby));
});

// 删除宝宝信息
export const deleteBaby = catchAsync(async (req, res) => {
  const { id } = req.query;
  // babyId 字段类型是 Schema.Types.ObjectId ，直接传字符串 id 可能会报类型不匹配，需要用 new mongoose.Types.ObjectId(id) 转换
  const babyId = new mongoose.Types.ObjectId(id as string);
  // 删除宝宝档案
  // await Baby.findByIdAndDelete(babyId);
  await Baby.deleteOne({ _id: babyId });
  // 同步删除用户<->宝宝关系表中的数据
  await UserBabyRelation.deleteMany({ babyId });
  res.json(Response.success("删除成功"));
});

// 关联宝宝
export const bindBaby = catchAsync(async (req, res) => {
  const { baby_no, relation } = req.body;
  // 获取当前用户 ID
  const userId = req.user!.id;
  // 1. 先校验格式，避免 ObjectId 构造抛错
  if (!baby_no || !mongoose.Types.ObjectId.isValid(baby_no)) {
    return res.json(
      Response.error(RESPONSE_CODE.PARAM_ERROR, "宝宝号格式不正确"),
    );
  }
  // 2.判断当前宝宝是否存在
  const baby = await Baby.findById(baby_no);
  if (!baby) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "当前宝宝不存在"));
  }
  // 3.判断当前用户是否已经绑定了当前宝宝
  const existing = await UserBabyRelation.findOne({
    userId,
    babyId: baby._id,
  });
  if (existing) {
    // 根据status判断是否解绑过
    if (existing.status === 1) {
      return res.json(
        Response.error(
          RESPONSE_CODE.BAD_REQUEST,
          "当前用户已绑定了该宝宝，请勿重复关联",
        ),
      );
    }
    // 曾经解绑过
    existing.status = 1;
    existing.relation = relation || existing.relation;
    await existing.save();
    return res.json(Response.success(null, "关联成功"));
  }
  // 4.创建当前用户与宝宝的关系记录（默认为观察者角色）
  await UserBabyRelation.create({
    userId,
    babyId: baby._id,
    relation: relation || "other",
    role: "observer",
  });
  return res.json(Response.success(null, "关联成功"));
});
