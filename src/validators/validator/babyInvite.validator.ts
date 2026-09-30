import { body, query } from "express-validator";

// 创建邀请链接
// 注意：inviterId 由服务端从登录态（req.user.id）获取，不接受客户端传参，防止伪造邀请人
// maxUses 固定为 1（每条链接仅限一位亲友使用），不接受客户端传参，由模型默认值兜底
export const createInviteLinkValidator = [
  body("babyId")
    .isMongoId()
    .withMessage("babyId格式不正确")
    .notEmpty()
    .withMessage("babyId不能为空"),
  body("relation")
    .isIn(["mother", "father", "grandparent", "other"])
    .withMessage("relation不合法")
    .notEmpty()
    .withMessage("relation不能为空"),
  body("expireDays")
    .isInt({ min: 7, max: 30 })
    .withMessage("expireDays需为7~30之间的整数")
    .notEmpty()
    .withMessage("expireDays不能为空")
    .toInt(),
];

// 获取邀请页面预览信息
// token 为 randomBytes(16) 生成的固定 32 位十六进制串，直接校验格式，
// 非法请求在中间件层即被拦截，避免无效查询打到数据库（该接口无需鉴权，可被随意访问）
export const getPreviewInfoValidator = [
  query("token")
    .isString()
    .withMessage("token格式不正确")
    .isHexadecimal()
    .withMessage("token格式不正确")
    .isLength({ min: 32, max: 32 })
    .withMessage("token格式不正确")
    .notEmpty()
    .withMessage("token不能为空"),
];
