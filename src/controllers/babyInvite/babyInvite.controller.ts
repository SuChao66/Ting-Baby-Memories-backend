// 导入工具函数
import { catchAsync, Response, generateInviteLinkToken } from "@/utils";
// 导入常量
import { RESPONSE_CODE, ONE_DAY } from "@/enums";
// 导入模型
import UserBabyRelation from "@/models/UserBabyRelation";
import BabyInvite from "@/models/BabyInvite";

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
