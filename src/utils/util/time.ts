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
