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
  // 获取数据
  const total = await Timeline.countDocuments({
    userId,
    babyId,
  } as any);
  const list = await Timeline.find({
    userId,
    babyId,
  } as any)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean();
  const result = {
    total,
    data: list,
  };
  res.json(Response.success(result, "获取成功"));
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
