// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE, VISIT_INTERVAL } from "@/enums";
// 引入用户与宝宝关系模型
import UserBabyRelation from "@/models/UserBabyRelation";

// 获取家庭成员列表
export const getFamilyList = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const babyId = req.query.babyId as string;
  // 1.判断当前用户是否是家庭成员，即是否有权限查看家庭成员列表
  const userRelation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!userRelation) {
    return res.json(
      Response.error(RESPONSE_CODE.FORBIDDEN, "无权查看该宝宝的家庭成员"),
    );
  }
  // 根据宝宝id获取家庭成员列表
  const familyList = await UserBabyRelation.find({
    babyId,
    status: 1,
  }).populate({
    path: "userId",
    select: "nickname avatarUrl",
  });
  res.json(Response.success(familyList, "获取家庭成员列表成功"));
});

// 记录访问次数和时间
export const recordVisit = catchAsync(async (req, res) => {
  const userId = req.user!.id;
  const { babyId } = req.body;

  // 1.权限校验
  const relation = await UserBabyRelation.findOne({
    userId,
    babyId,
    status: 1,
  });
  if (!relation) {
    return res.json(Response.error(RESPONSE_CODE.FORBIDDEN, "无权访问该宝宝"));
  }

  // 2.防刷：首次访问或距上次访问超 30 分钟才计数并刷新时间
  const shouldRecord =
    !relation.lastVisitAt ||
    Date.now() - relation.lastVisitAt.getTime() >= VISIT_INTERVAL;

  if (shouldRecord) {
    await UserBabyRelation.updateOne(
      { _id: relation._id },
      {
        $inc: { visitCount: 1 },
        $set: { lastVisitAt: new Date() },
      },
    );
  }

  res.json(Response.success(null, "记录成功"));
});
