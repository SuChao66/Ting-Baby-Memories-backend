// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";
// 导入模型
import Timeline from "@/models/Timeline";
import UserBabyRelation from "@/models/UserBabyRelation";

// 根据babyId获取某宝宝的记录
export const getTimeline = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取请求参数
  const { babyId, page, pageSize } = req.body;
  // 校验当前babyId和userId的关系，禁止越权获取
  const relations = await UserBabyRelation.find({
    userId,
    babyId,
    status: 1,
  });
  if (!relations.length) {
    return res.json(Response.error(RESPONSE_CODE.UNAUTHORIZED, "权限不足"));
  }
  // 查询条件
  const query = {
    babyId,
    $or: [
      { visibleRoles: { $in: ["public", "family"] } },
      {
        visibleRoles: "private",
        userId,
      },
    ],
  };
  // 1.查 Timeline 记录（populate 拿昵称、头像）
  const total = await Timeline.countDocuments(query as any);
  const list = await Timeline.find(query as any)
    .populate("userId", "nickname avatarUrl")
    .sort({ publishTime: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  // 2.查询该宝宝的所有家庭成员关系，按userId进行映射
  const all_releations = await UserBabyRelation.find({
    babyId,
    status: 1,
  }).lean();
  const relationMap = new Map();
  all_releations.forEach((r) => {
    relationMap.set(r.userId.toString(), r.relation);
  });
  // 3.把 relation 合并到每条记录的发布者信息上
  const data = list.map((item) => ({
    ...item,
    userInfo: {
      ...(item.userId as any), // _id, nickname, avatarUrl
      relation: relationMap.get((item.userId as any)._id.toString()),
    },
  }));
  // 4.响应
  res.json(Response.success({ total, data }, "获取成功"));
});

// 发布记录
export const addTimeLine = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取请求参数
  const {
    babyId,
    content,
    files,
    tags,
    isMilestone,
    publishTime,
    visibleRoles,
  } = req.body;
  // 校验当前babyId和userId的关系，禁止越权写入
  const relations = await UserBabyRelation.find({
    userId,
    babyId,
    status: 1,
  });
  if (!relations.length) {
    return res.json(Response.error(RESPONSE_CODE.UNAUTHORIZED, "权限不足"));
  }
  const timeline = new Timeline({
    userId,
    babyId,
    content: content,
    files: files ? files : [],
    tags: tags ? tags : [],
    isMilestone: isMilestone,
    publishTime: publishTime,
    visibleRoles: visibleRoles,
  });
  await timeline.save();
  return res.json(Response.success(null, "发布成功"));
});
