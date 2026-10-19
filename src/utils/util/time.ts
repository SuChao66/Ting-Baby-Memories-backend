// 北京时间时区偏移：UTC+8
const BEIJING_OFFSET_MS = 8 * 60 * 60 * 1000;

/**
 * 按北京时间（UTC+8）计算某日期当天的 [开始, 结束) 时间范围（UTC Date，可直接用于 Mongo 查询）
 * 注意：北京时间 00:00 = UTC 前一天 16:00，因此需在 UTC 零点基础上减 8 小时，
 * 直接用 Date.UTC(y, m, d) 会把查询起点错切到北京 08:00
 * @param date 格式 YYYY-MM-DD
 * */
export const getBeijingDayRange = (date: string) => {
  const [y, m, d] = date.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(y, m - 1, d) - BEIJING_OFFSET_MS);
  const endOfDay = new Date(Date.UTC(y, m - 1, d + 1) - BEIJING_OFFSET_MS);
  return { startOfDay, endOfDay };
};

// 格式化日期
export const formatDate = (date?: Date) => {
  const today = date ? new Date(date) : new Date();
  return {
    fullDate: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`,
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    day: today.getDate(),
    hour: today.getHours(),
    minute: today.getMinutes(),
    seconds: today.getSeconds(),
  };
};
