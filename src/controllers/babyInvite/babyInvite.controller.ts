// 导入工具函数
import { catchAsync, Response, generateInviteLinkToken } from "@/utils";
// 导入常量
import { RESPONSE_CODE, ONE_DAY, NUMBER } from "@/enums";
// 导入模型
import UserBabyRelation from "@/models/UserBabyRelation";
import BabyInvite from "@/models/BabyInvite";
import User from "@/models/User";
import Baby from "@/models/Baby";

// 创建邀请链接
export const createInviteLink = catchAsync(async (req, res) => {
  // 获取用户id
  const userId = req.user?.id;
  // 获取请求参数
  const { babyId, relation, expireDays } = req.body;
  // 判断当前用户和宝宝的关系
  const relationResult = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  }).lean();
  if (!relationResult) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "权限不足"));
  }
  // 生成随机 token（crypto.randomBytes，128 位熵，不可预测不可枚举）
  const token = generateInviteLinkToken();
  // 计算过期时间（expireDays 天后）
  const expiresAt = new Date(Date.now() + expireDays * ONE_DAY);
  // 创建邀请记录（role/maxUses/usedCount/status 走模型默认值：observer / 1 / 0 / 1）
  await BabyInvite.create({
    babyId,
    inviterId: userId,
    relation,
    token,
    expiresAt,
  });

  return res.json(Response.success(token, "success"));
});

// 获取邀请页面预览信息(无需鉴权)
// 安全原则：仅返回最小必要信息（邀请人昵称、宝宝昵称头像、预设关系），防止 token 被试探时泄露敏感数据
export const getPreviewInfo = catchAsync(async (req, res) => {
  // token 已在 validator 中校验格式（32 位十六进制），此处断言为 string
  const token = req.query.token as string;
  // 查询有效邀请：未作废、未过期、未被使用（maxUses 固定 1，被接受后链接立即失效）
  const invite = await BabyInvite.findOne({
    token,
    status: 1,
    expiresAt: { $gt: new Date() },
    usedCount: NUMBER.ZERO,
  }).lean();
  if (!invite) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "邀请链接已失效"));
  }
  // 并行查询邀请人与宝宝信息
  const [inviter, baby, relation] = await Promise.all([
    User.findOne({ _id: invite.inviterId }, { avatarUrl: 1, _id: 0 }).lean(),
    Baby.findOne(
      { _id: invite.babyId },
      { nickname: 1, avatarUrl: 1, _id: 1 },
    ).lean(),
    UserBabyRelation.findOne(
      {
        userId: invite.inviterId,
        babyId: invite.babyId,
        status: 1,
      },
      { relation: 1, _id: 0 },
    ).lean(),
  ]);

  return res.json(
    Response.success(
      {
        inviterAvatarUrl: inviter?.avatarUrl ?? "",
        babyNickname: baby?.nickname ?? "",
        babyId: baby?._id ?? "",
        relation: relation?.relation ?? "",
        expiresAt: invite.expiresAt,
      },
      "success",
    ),
  );
});

// 加入成长圈
// 安全原则：babyId 以 token 反查的邀请记录为准，不信任客户端传参，防止伪造/越权加入任意成长圈
// 并发安全：通过原子更新占用名额（usedCount 0 -> 1），同一条链接并发请求只有一个能成功
export const joinFamily = catchAsync(async (req, res) => {
  // 获取userId
  const userId = req.user?.id;
  // 获取入参（babyId 不从入参取，由邀请记录提供）
  const { token, nickname, relation } = req.body;

  // 原子校验并占用邀请：仅未作废、未过期、未被使用的链接可被接受
  const invite = await BabyInvite.findOneAndUpdate(
    {
      token,
      status: 1,
      usedCount: NUMBER.ZERO,
      expiresAt: { $gt: new Date() },
    },
    { $inc: { usedCount: NUMBER.ONE } }, // usedCount 0 -> 1 加1操作
    { new: true }, // true 返回更新后的文档
  ).lean();
  if (!invite) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "邀请链接已失效"));
  }

  // 判断当前用户是否已在该宝宝成长圈
  const babyId = invite.babyId;
  const relationResult = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  }).lean();
  if (relationResult) {
    // 已加入：释放名额，链接保留给其他被邀请人使用
    await BabyInvite.updateOne(
      { _id: invite._id, usedCount: NUMBER.ONE },
      { $inc: { usedCount: NUMBER.ZERO - NUMBER.ONE } }, // usedCount 1 -> 0 减1操作
    );
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "您已加入成长圈"));
  }

  try {
    // 更新用户信息
    await User.updateOne({ _id: userId }, { nickname });
    // 绑定当前用户和宝宝关系（userId+babyId 唯一索引兜底重复创建）
    await UserBabyRelation.create({
      userId,
      babyId,
      relation,
      status: 1,
    });
  } catch (error) {
    // 绑定失败：释放被占用的名额，避免邀请链接被白白作废
    await BabyInvite.updateOne(
      { _id: invite._id, usedCount: NUMBER.ONE },
      { $inc: { usedCount: NUMBER.ZERO - NUMBER.ONE } }, // usedCount 1 -> 0 减1操作
    );
    throw error;
  }

  return res.json(Response.success(null, "success"));
});
