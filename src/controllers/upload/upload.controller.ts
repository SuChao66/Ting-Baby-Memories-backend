// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE, NUMBER, ALLOWED_CONTENT_TYPES } from "@/enums";
// 引入配置模块
import config from "@/config";
// 引入 COS SDK
import COS from "cos-nodejs-sdk-v5";

// 创建 COS 实例（仅在此模块初始化一次）
const cos = new COS({
  SecretId: config.cos.secretId,
  SecretKey: config.cos.secretKey,
});

// 拼接永久访问 URL
// https://ting-baby-memories-1257931939.cos.ap-shanghai.myqcloud.com
function buildAccessUrl(key: string): string {
  if (config.cos.cdnDomain) {
    return `${config.cos.cdnDomain}/${key}`;
  }
  return `https://${config.cos.bucket}.cos.${config.cos.region}.myqcloud.com/${key}`;
}

// 获取上传文件的预签名URL
export const getPresignedUrl = catchAsync(async (req, res) => {
  const { filename, contentType } = req.body;

  // 1. 校验 Content-Type 白名单
  if (!ALLOWED_CONTENT_TYPES.includes(contentType)) {
    return res.json(Response.error(RESPONSE_CODE.BAD_REQUEST, "不支持该类型"));
  }

  // 2. 生成唯一对象 key：avatar/{username}/{filename}
  const username = req.user!.username;
  const key = `avatar/${username}/${filename}`;

  // 3. 生成预签名上传 URL（PUT 方法，5 分钟有效期）
  // 设置 x-cos-acl: public-read，使上传后的对象可公开访问
  const uploadUrl = cos.getObjectUrl({
    Bucket: config.cos.bucket,
    Region: config.cos.region,
    Key: key,
    Method: "PUT",
    Sign: true,
    Expires: NUMBER.HUNDRED * NUMBER.THREE,
    Headers: {
      "Content-Type": contentType,
      "x-cos-acl": "public-read", // 公开读取权限
    },
  });

  // 4. 拼接永久访问 URL
  const accessUrl = buildAccessUrl(key);

  res.json(Response.success({ uploadUrl, accessUrl }, "获取预签名URL成功"));
});
