export function getWeekNumber(date) {
  const day = date.getDate();
  return Math.ceil(day / 7); // 1~7일은 1주, 8~14일은 2주, ..., 최대 5주
}
