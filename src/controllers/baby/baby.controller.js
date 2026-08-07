const Baby = require("../../models/Baby");
// 引入响应工具模块
const Response = require("../../utils/response");

// 获取宝宝信息（单条记录）
exports.getBabyInfo = async (req, res, next) => {
  try {
    let baby = await Baby.findOne();
    if (!baby) {
      baby = await Baby.create({ name: "宝宝", birthday: new Date().toISOString().slice(0, 10) });
    }
    res.json(Response.success(baby));
  } catch (err) {
    next(err);
  }
};

// 更新宝宝信息
exports.updateBabyInfo = async (req, res, next) => {
  try {
    const { name, birthday, avatar } = req.body;
    let baby = await Baby.findOne();
    if (!baby) {
      baby = await Baby.create({ name, birthday, avatar });
    } else {
      if (name !== undefined) baby.name = name;
      if (birthday !== undefined) baby.birthday = birthday;
      if (avatar !== undefined) baby.avatar = avatar;
      await baby.save();
    }
    res.json(Response.success(baby));
  } catch (err) {
    next(err);
  }
};
