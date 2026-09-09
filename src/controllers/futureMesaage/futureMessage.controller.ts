import mongoose from "mongoose";
import { catchAsync, Response } from "@/utils";
// 导入模型
import FutureMessage from "@/models/FutureMessage";
import UserBabyRelation from "@/models/UserBabyRelation";
import FutureMessageRead from "@/models/FutureMessageRead";
// 导入常量
import { RESPONSE_CODE } from "@/enums";

// 获取未来寄语列表
export const getFutureMessageList = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId, isUnlock, page, pageSize } = req.body;
  // 校验user和babyId的关系，是否越权访问
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 封装查询条件(分页查询)
  const query = {
    babyId,
    revealDate: isUnlock ? { $lt: new Date() } : { $gt: new Date() },
    $or: [
      { visibleRoles: { $in: ["public", "family"] } },
      {
        visibleRoles: "private",
        userId,
      },
    ],
  };
  const total = await FutureMessage.countDocuments(query as any);
  const list = await FutureMessage.find(query as any)
    .populate("userId", "nickname avatarUrl")
    .sort({ revealDate: 1 })
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
  // 3.查询当前用户对当前页信件的已读记录（仅已解锁列表需要，用于前端展示未读标识）
  const readSet = new Set<string>();
  if (isUnlock && list.length) {
    const reads = await FutureMessageRead.find({
      userId,
      messageId: { $in: list.map((item) => item._id) },
    })
      .select("messageId")
      .lean();
    reads.forEach((r) => readSet.add(r.messageId.toString()));
  }
  // 4.把 relation 合并到每条记录的发布者信息上（用户可能已被删除，populate 结果为 null，需兜底）
  const data = list.map((item) => {
    const author = (item.userId as any) || {};
    return {
      ...item,
      userInfo: {
        ...author, // _id, nickname, avatarUrl
        relation: author._id
          ? relationMap.get(author._id.toString())
          : undefined,
      },
      // 已解锁列表返回已读状态（未解锁列表无已读概念，不返回）
      isRead: isUnlock ? readSet.has(item._id.toString()) : undefined,
    };
  });
  return res.json(Response.success({ total, list: data }, "获取成功"));
});

// 获取已解锁未读的信件数量
export const getUnlockCount = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参
  const { babyId } = req.query as any;
  // 校验user和babyId的关系，是否越权访问
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 封装查询条件(已解锁且该用户可见)
  const query = {
    babyId,
    revealDate: { $lt: new Date() },
    $or: [
      { visibleRoles: { $in: ["public", "family"] } },
      {
        visibleRoles: "private",
        userId,
      },
    ],
  };
  // 查询当前用户全部已读的信件id（包含其他宝宝的也不影响，$nin 取交集）
  // distinct: 去重，并返回一个数组
  const readMessageIds = await FutureMessageRead.distinct("messageId", {
    userId,
  });
  // 排除已读的，剩余即为未读数量
  const total = await FutureMessage.countDocuments({
    ...query,
    _id: { $nin: readMessageIds },
  } as any);
  return res.json(Response.success(total, "获取成功"));
});

// 添加未来寄语
export const addFutureMessage = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取入参
  const { babyId, content, revealDate, files, visibleRoles } = req.body;
  // 判断当前用户是否有权限给宝宝新增寄语（status: 1-正常，0-已移除）
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 创建寄语（失败会抛出异常，由 catchAsync 统一处理）
  const futureMessage = await FutureMessage.create({
    userId,
    babyId,
    content,
    revealDate,
    files,
    visibleRoles,
  });
  return res.json(Response.success(futureMessage._id, "创建成功"));
});

// 更新未来寄语
export const updateFutureMessage = catchAsync(async (req, res) => {
  // 获取当前userId
  const userId = req.user?.id;
  // 获取入参
  const { id, content, revealDate, files, visibleRoles } = req.body;
  // 判断当前用户是否可以编辑该寄语
  const futureMessage = await FutureMessage.findOneAndUpdate(
    {
      _id: id,
      userId,
      revealDate: { $gt: new Date() },
    },
    { content, revealDate, files, visibleRoles },
    { runValidators: true },
  );
  if (!futureMessage) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "寄语不存在或已解锁，无法修改"),
    );
  }
  return res.json(Response.success(null, "更新成功"));
});

// 删除未来寄语
export const deleteFutureMessage = catchAsync(async (req, res) => {
  // 获取当前userId
  const userId = req.user?.id;
  // 获取入参
  const id = req.query.id as string;
  const futureMessage = await FutureMessage.findOneAndDelete({
    _id: id,
    userId,
    revealDate: { $gt: new Date() },
  });
  if (!futureMessage) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "寄语不存在或已解锁，无法删除"),
    );
  }
  // 级联清理该信件的已读记录，避免垃圾数据
  await FutureMessageRead.deleteMany({ messageId: id });
  return res.json(Response.success(null, "删除成功"));
});

// 标记未来寄语为已读
export const markFutureMessageRead = catchAsync(async (req, res) => {
  // 1.获取用户id（auth 中间件保证存在）
  const userId = req.user?.id as string;
  // 2.获取入参
  const { babyId, messageIds } = req.body;
  // 3.校验user和babyId的关系，是否越权访问
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 4.校验messageId对应的寄语是否存在,且已解锁
  const validMessages = await FutureMessage.find(
    {
      _id: { $in: messageIds },
      babyId,
      revealDate: { $lt: new Date() },
      $or: [
        { visibleRoles: { $in: ["public", "family"] } },
        { visibleRoles: "private", userId },
      ],
    },
    {
      _id: 1,
    },
  ).lean();
  if (!validMessages.length) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "寄语不存在或不可标记为已读"),
    );
  }
  // 批量 upsert，幂等且无竞态（update 的字段类型要求 ObjectId，需先转换 userId）
  const userObjectId = new mongoose.Types.ObjectId(userId);
  await FutureMessageRead.bulkWrite(
    validMessages.map((m) => ({
      updateOne: {
        filter: { userId: userObjectId, messageId: m._id },
        update: { $setOnInsert: { userId: userObjectId, messageId: m._id } },
        upsert: true,
      },
    })),
  );
  return res.json(Response.success(null, "标记成功"));
});
