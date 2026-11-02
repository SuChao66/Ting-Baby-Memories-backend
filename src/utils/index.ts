import Response from "@/utils/util/response";
import { sign as jwtSign, verify as jwtVerify } from "@/utils/util/jwt";
import ApiError from "@/utils/util/ApiError";
import catchAsync from "@/utils/util/catchAsync";
import logger from "@/utils/util/logger";
import swagger from "@/utils/util/swagger";
import { encrypt, decrypt } from "@/utils/util/encrypt";
import { getExt } from "@/utils/util/file";
import {
  formatDate,
  getBeijingDayRange,
  getBeijingTime,
} from "@/utils/util/time";
import { generateInviteLinkToken } from "@/utils/util/common";
import {
  chat as deepseekChat,
  chatStream as deepseekChatStream,
} from "@/utils/util/deepseek";
import type { ChatMessage, ChatOptions } from "@/utils/util/deepseek";

const JWT = { sign: jwtSign, verify: jwtVerify };

const DeepSeek = {
  chat: deepseekChat,
  chatStream: deepseekChatStream,
};

export {
  Response,
  JWT,
  ApiError,
  catchAsync,
  logger,
  swagger,
  encrypt,
  decrypt,
  getExt,
  formatDate,
  getBeijingDayRange,
  getBeijingTime,
  generateInviteLinkToken,
  DeepSeek,
};

export type { ChatMessage, ChatOptions };
