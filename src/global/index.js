// 引入第三方中间件模块
const registerThirdPartyMiddleware = require("./register.third.middleware");
// 引入自定义中间件模块
const registerCustomMiddleware = require("./register.custom.middleware");

// 注册中间件
const registerAllMiddleware = (app) => {
  // 注册第三方中间件
  registerThirdPartyMiddleware(app);
  // 注册自定义中间件
  registerCustomMiddleware(app);
};

module.exports = registerAllMiddleware;
