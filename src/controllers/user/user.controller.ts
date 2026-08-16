// 引入响应工具模块
import { Response, catchAsync, JWT } from "@/utils";
// 导入常量
import { RESPONSE_CODE, NUMBER } from "@/enums";
// 引入用户模型
import User from "@/models/User";
// 引入配置模块
import config from "@/config";

// 登录
export const login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  // 1.判断用户是否存在
  const user = await User.findOne({ username });
  if (!user) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "用户不存在"));
  }
  // 2.判断密码是否正确
  if (user.password !== password) {
    return res.json(Response.error(RESPONSE_CODE.BAD_REQUEST, "密码错误"));
  }
  // 3.登录成功，生成token并写入cookie
  const token = JWT.sign({ id: user._id, username: user.username });
  const maxAge =
    NUMBER.SEVEN *
    NUMBER.TWELVE *
    NUMBER.TWO *
    NUMBER.SIXTY *
    NUMBER.SIXTY *
    NUMBER.THOUSAND;
  res.cookie("token", token, {
    httpOnly: true, // 禁止前端 JS 访问，防 XSS
    secure: config.env === "production", // 生产环境仅 HTTPS
    sameSite: "lax", // 防御 CSRF
    maxAge: maxAge, // 7天，与 token 有效期保持一致
  });
  return res.json(
    Response.success({ token, userInfo: user.toJSON() }, "登录成功"),
  );
});

// 注册
export const register = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  // 判断当前用户是否已存在
  const user = await User.findOne({ username });
  if (user) {
    return res.json(Response.error(RESPONSE_CODE.BAD_REQUEST, "用户名已存在"));
  }
  // 创建新用户
  const newUser = new User({
    username,
    password,
  });
  await newUser.save();
  res.json(Response.success("注册成功"));
});

// 忘记密码
export const forgetPassword = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  // 获取当前用户是否存在
  const user = await User.findOne({ username });
  if (!user) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "用户不存在"));
  }
  // 判断密码是否与旧密码相同
  if (password === user.password) {
    return res.json(
      Response.error(RESPONSE_CODE.BAD_REQUEST, "新密码不能与旧密码相同"),
    );
  }
  // 更新用户密码
  user.password = password;
  await user.save();
  res.json(Response.success("修改密码成功"));
});

// 获取用户信息
export const getUserInfo = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user!.id });
  if (!user) {
    return res.json(Response.error(RESPONSE_CODE.NOT_FOUND, "用户不存在"));
  }
  res.json(Response.success(user?.toJSON(), "获取用户信息成功"));
});
