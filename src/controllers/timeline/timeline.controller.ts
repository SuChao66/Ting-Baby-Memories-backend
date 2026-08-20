// 引入响应工具模块
import { Response, catchAsync } from "@/utils";
// 导入常量
// import { RESPONSE_CODE } from "@/enums";

// 根据babyId获取某宝宝的记录
export const getTimeline = catchAsync(async (req, res) => {
  Response.success("获取成功");
});
