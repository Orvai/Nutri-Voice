const dayjs = require("dayjs");

const isToday = (date) => dayjs(date).isSame(dayjs(), "day");

module.exports = { isToday };
