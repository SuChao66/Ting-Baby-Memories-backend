// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
import { RESPONSE_CODE } from "@/enums";
// 导入模型
import Tag from "@/models/Tags";

// 根据userId获取某用户的标签
export const getTagsList = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "请先登录"));
  }
  // 获取标签
  const tagsList = await Tag.find({ userId });
  return res.json(Response.success(tagsList, "获取成功"));
});

// 新增标签
export const addTag = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const { name } = req.body;
  if (!userId) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "请先登录"));
  }
  // 去重，判断当亲name是否存在
  const existed = await Tag.findOne({ userId, name: name.trim() });
  if (existed) {
    return res.json(Response.error(RESPONSE_CODE.PARAM_ERROR, "标签已存在"));
  }
  const tag = new Tag({
    userId,
    name: name.trim(),
  });
  await tag.save();
  return res.json(Response.success("新增成功"));
});

// 删除标签
export const deleteTag = catchAsync(async (req, res) => {
  const userId = req.user?.id;
  const id = req.query.id as string;
  if (!userId) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "请先登录"));
  }
  if (!id) {
    return res.json(Response.error(RESPONSE_CODE.PARAM_ERROR, "缺少标签ID"));
  }
  // 判断是否删除成功
  const result = await Tag.findOneAndDelete({ _id: id, userId });
  if (!result) {
    return res.json(
      Response.error(RESPONSE_CODE.NOT_FOUND, "标签不存在或无权删除"),
    );
  }
  return res.json(Response.success("删除成功"));
});
