import { Request, Response } from "express";
import { Response as ApiResponse } from "@/utils";
import { RESPONSE_CODE } from "@/enums";

// 404 处理
function notFoundMiddleware(req: Request, res: Response): void {
  res
    .status(RESPONSE_CODE.NOT_FOUND)
    .json(ApiResponse.error("接口不存在", RESPONSE_CODE.NOT_FOUND));
}

export default notFoundMiddleware;
