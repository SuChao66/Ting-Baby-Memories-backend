const jwt = require("jsonwebtoken");
// 引入config.js
const config = require("../../config");

// 签发 JWT
const sign = (payload) =>
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.expiresIn });

// 验证 JWT
const verify = (token) => jwt.verify(token, config.jwtSecret);

module.exports = {
  sign,
  verify,
};
