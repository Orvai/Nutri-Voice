const { prisma } = require('../db/prisma');
const { DaySelectionCreateDto } = require('../dto/daySelection.dto');
const { getStartOfDay, getEndOfDay } = require('../utils/date.utils');

const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

const findSelectionForDate = async (clientId, date) => {
  return prisma.daySelection.findFirst({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(date),
        lte: getEndOfDay(date)
      }
    },
    orderBy: { changedAt: 'desc' } 
  });
};

const setDayType = async (clientId, parsed) => {
  const targetDate = parsed.date ? new Date(parsed.date) : new Date();
  
  const existing = await findSelectionForDate(clientId, targetDate);
  const cleanDate = getStartOfDay(targetDate);

  if (existing) {
    return prisma.daySelection.update({
      where: { id: existing.id },
      data: {
        dayType: parsed.dayType,
        date: cleanDate,
        changedAt: new Date(), // ✅ תוקן: היה new DateTime() שזה שגיאה
      },
    });
  }

  return prisma.daySelection.create({
    data: {
      clientId,
      dayType: parsed.dayType,
      date: cleanDate,
    },
  });
};

const getTodayDayType = async (clientId) => {
  return findSelectionForDate(clientId, new Date());
};

const getWeekDayTypes = async (clientId) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  
  const start = getStartOfDay(today);
  start.setDate(today.getDate() - dayOfWeek); 
  
  const end = getEndOfDay(new Date(start));
  end.setDate(start.getDate() + 6); 

  return prisma.daySelection.findMany({
    where: {
      clientId,
      date: { gte: start, lte: end }
    },
    orderBy: { date: 'asc' }
  });
};

module.exports = { setDayType, getTodayDayType, getWeekDayTypes };