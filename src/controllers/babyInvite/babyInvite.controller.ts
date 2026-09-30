// 导入工具函数
import { catchAsync, Response, generateInviteLinkToken } from "@/utils";
// 导入常量
import { RESPONSE_CODE, ONE_DAY } from "@/enums";
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
    usedCount: 0,
  }).lean();
  if (!invite) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "邀请链接已失效"));
  }
  // 并行查询邀请人与宝宝信息
  const [inviter, baby, relation] = await Promise.all([
    User.findOne({ _id: invite.inviterId }, { avatarUrl: 1, _id: 0 }).lean(),
    Baby.findOne(
      { _id: invite.babyId },
      { nickname: 1, avatarUrl: 1, _id: 0 },
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
        relation: relation?.relation ?? "",
        expiresAt: invite.expiresAt,
      },
      "success",
    ),
  );
});
