import Baby from "@/models/Baby";
import UserBabyRelation from "@/models/UserBabyRelation";
// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

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
  const baby = await Baby.findOne();
  if (!baby) {
    res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "未获取到宝宝信息"));
  }
  res.json(Response.success(baby));
});

// 更新宝宝信息
export const updateBabyInfo = catchAsync(async (req, res) => {
  const { name, birthday, avatar } = req.body;
  let baby = await Baby.findOne();
  if (!baby) {
    baby = await Baby.create({ nickname: name, birthday, avatarUrl: avatar });
  } else {
    if (name !== undefined) baby.nickname = name;
    if (birthday !== undefined) baby.birthday = birthday;
    if (avatar !== undefined) baby.avatarUrl = avatar;
    await baby.save();
  }
  res.json(Response.success(baby));
});
