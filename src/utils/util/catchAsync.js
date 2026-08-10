// 异步错误捕获包装器，消除 controller 中重复的 try/catch 模板
function catchAsync(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

module.exports = catchAsync;
