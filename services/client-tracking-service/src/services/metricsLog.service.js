const { prisma } = require('../db/prisma');
const { getStartOfDay, getEndOfDay } = require('../utils/date.utils');

const findMetricsForDate = async (clientId, date) => {
  return prisma.metricsLog.findFirst({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(date),
        lte: getEndOfDay(date)
      }
    }
  });
};

const upsertMetricsLog = async (clientId, data) => {
  const targetDate = data.date ? new Date(data.date) : new Date();
  const existing = await findMetricsForDate(clientId, targetDate);
  const cleanDate = getStartOfDay(targetDate);

  const payload = {
    steps: data.steps,
    waterLiters: data.waterLiters,
    sleepHours: data.sleepHours,
    notes: data.notes,
  };

  if (existing) {
    return prisma.metricsLog.update({
      where: { id: existing.id },
      data: { ...payload, date: cleanDate },
    });
  }

  return prisma.metricsLog.create({
    data: { clientId, date: cleanDate, ...payload },
  });
};

const listMetricsHistory = async (clientId, startDate, endDate) => {
  return prisma.metricsLog.findMany({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(startDate),
        lte: getEndOfDay(endDate)
      }
    },
    orderBy: { date: 'asc' }
  });
};

module.exports = {
  upsertMetricsLog,
  listMetricsHistory,
  findMetricsForDate
};