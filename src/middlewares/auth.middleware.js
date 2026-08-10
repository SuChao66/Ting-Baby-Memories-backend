const { Response, JWT } = require("../utils");

// 权限认证中间件
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json(Response.error("未授权，请先登录", 401));
  }
  try {
    const token = authHeader.split(" ")[1];
    req.user = JWT.verify(token);
    next();
  } catch {
    return res.status(401).json(Response.error("token 无效或已过期", 401));
  }
};

module.exports = authMiddleware;
