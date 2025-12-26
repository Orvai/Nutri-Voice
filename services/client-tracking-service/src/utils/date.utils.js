// fileName: src/utils/date.utils.js
const { startOfDay, endOfDay, subDays } = require('date-fns');

/**
 * מחזיר את תחילת היום (00:00:00)
 */
const getStartOfDay = (date = new Date()) => {
  return startOfDay(new Date(date));
};


const getEndOfDay = (date = new Date()) => {
  return endOfDay(new Date(date));
};

const getDateDaysAgo = (days) => {
  return subDays(new Date(), days);
};

module.exports = {
  getStartOfDay,
  getEndOfDay,
  getDateDaysAgo,
};