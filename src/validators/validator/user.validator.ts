import { body } from "express-validator";
// 导入常量
import { PASSWORD_REGEX } from "@/enums";

// 登录校验规则
export const loginValidator = [
  body("username").notEmpty().withMessage("用户名不能为空"),
  body("password").notEmpty().withMessage("密码不能为空"),
];

// 注册校验规则/忘记密码校验规则
export const registerOrForgetPasswordValidator = [
  body("username").notEmpty().withMessage("用户名不能为空"),
  body("password").notEmpty().withMessage("密码不能为空"),
  body("confirmPassword").notEmpty().withMessage("确认密码不能为空"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("两次输入密码不一致");
    }
    return true;
  }),
  body("password")
    .matches(PASSWORD_REGEX)
    .withMessage(
      "密码强度不符合要求，请包含至少6个字符，包括大小写字母、数字和特殊字符",
    ),
];

// 修改密码校验规则
export const changePasswordValidator = [
  body("oldPassword").notEmpty().withMessage("原密码不能为空"),
  body("newPassword").notEmpty().withMessage("新密码不能为空"),
  body("confirmPassword").notEmpty().withMessage("确认密码不能为空"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("两次输入密码不一致");
    }
    return true;
  }),
  body("newPassword")
    .matches(PASSWORD_REGEX)
    .withMessage(
      "密码强度不符合要求，请包含至少6个字符，包括大小写字母、数字和特殊字符",
    ),
];
