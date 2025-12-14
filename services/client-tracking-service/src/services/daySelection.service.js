const { prisma } = require('../db/prisma');
const { DaySelectionCreateDto } = require('../dto/daySelection.dto');

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
        gte: startOfDay(date),
        lte: endOfDay(date)
      }
    },
    orderBy: { changedAt: 'desc' }
  });
};

const setDayType = async (clientId, payload) => {
  const parsed = DaySelectionCreateDto.parse(payload);
  const targetDate = parsed.date ? new Date(parsed.date) : new Date();
  const existing = await findSelectionForDate(clientId, targetDate);

  if (existing) {
    return prisma.daySelection.update({
      where: { id: existing.id },
      data: {
        dayType: parsed.dayType,
        date: startOfDay(targetDate),
        changedAt: new Date()
      }
    });
  }

  return prisma.daySelection.create({
    data: {
      clientId,
      dayType: parsed.dayType,
      date: startOfDay(targetDate)
    }
  });
};

const getTodayDayType = async (clientId) => {
  const today = new Date();
  return findSelectionForDate(clientId, today);
};

const getWeekDayTypes = async (clientId) => {
  const today = startOfDay(new Date());
  const start = startOfDay(new Date(today));
  start.setDate(start.getDate() - start.getDay());
  const end = endOfDay(new Date(start));
  end.setDate(end.getDate() + 6);

  return prisma.daySelection.findMany({
    where: {
      clientId,
      date: { gte: start, lte: end }
    },
    orderBy: { date: 'asc' }
  });
};

module.exports = { setDayType, getTodayDayType, getWeekDayTypes };