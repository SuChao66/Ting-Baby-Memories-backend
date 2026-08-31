import mongoose from "mongoose";
// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE, TIME_LINE_VISIBLE_ROLES } from "@/enums";
// 导入模型
import Timeline from "@/models/Timeline";
import UserBabyRelation from "@/models/UserBabyRelation";
import User from "@/models/User";

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

// 更新记录
export const editTimeLine = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const { id, content, files, tags, isMilestone, publishTime, visibleRoles } =
    req.body;
  // 查询记录（仅能更新自己的记录）
  const timeline = await Timeline.findOne({ _id: id, userId } as any);
  if (!timeline) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "未获取到记录信息"),
    );
  }
  if (content !== undefined) timeline.content = content;
  if (files !== undefined) timeline.files = files;
  if (tags !== undefined) timeline.tags = tags;
  if (isMilestone !== undefined) timeline.isMilestone = isMilestone;
  if (publishTime !== undefined) timeline.publishTime = publishTime;
  if (visibleRoles !== undefined) timeline.visibleRoles = visibleRoles;
  await timeline.save();
  return res.json(Response.success("更新成功"));
});

// 发表评论
export const publishComment = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const { id, comment } = req.body;
  // 查询记录
  const timeline = await Timeline.findById(id);
  if (!timeline) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "未获取到记录信息"),
    );
  }
  // 可见性校验：private 仅发布者本人可评论
  if (
    timeline.visibleRoles === TIME_LINE_VISIBLE_ROLES.PRIVATE &&
    timeline.userId.toString() !== userId
  ) {
    return res.json(Response.error(RESPONSE_CODE.UNAUTHORIZED, "权限不足"));
  }
  // 获取当前用户信息
  const userInfo = await User.findOne(
    { _id: userId },
    { nickname: 1, avatarUrl: 1, _id: 0 },
  ).lean();
  if (comment) {
    timeline.comments?.push({
      ...comment,
      userId,
      userInfo: { ...userInfo, releation: comment.releation },
    });
  }
  await timeline.save();
  return res.json(Response.success("发表评论成功"));
});

// 获取记录详情
export const getTimeLineInfo = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取记录id
  const { id } = req.query;
  // 根据id获取当前记录详情
  const timeline = await Timeline.findById(id);
  if (!timeline) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "获取失败"));
  }
  // 如果是 private 记录，校验是否为发布者本人
  if (
    timeline.visibleRoles === TIME_LINE_VISIBLE_ROLES.PRIVATE &&
    timeline.userId.toString() !== userId
  ) {
    return res.json(Response.error(RESPONSE_CODE.UNAUTHORIZED, "权限不足"));
  }
  return res.json(Response.success(timeline, "获取成功"));
});

// 删除记录
export const deleteTimeLineInfo = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取记录id
  const id = req.query.id as string;
  // 删除记录
  const result = await Timeline.findOneAndDelete({
    _id: new mongoose.Types.ObjectId(id),
    userId,
  } as any);
  if (!result) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "记录不存在或无权删除"),
    );
  }
  return res.json(Response.success("删除成功"));
});
