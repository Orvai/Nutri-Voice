const { prisma } = require('../db/prisma');
const { WeightLogCreateDto,WeightLogUpdateDto } = require('../dto/weightLog.dto');

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

const createWeightLog = async (clientId, payload) => {
  const data = WeightLogCreateDto.parse(payload);
  const logDate = data.date ? new Date(data.date) : new Date();

  return prisma.weightLog.create({
    data: {
      clientId,
      date: logDate,
      weightKg: data.weightKg,
      notes: data.notes
    }
  });
};

const listWeightHistory = (clientId) => {
  return prisma.weightLog.findMany({
    where: { clientId },
    orderBy: { date: 'asc' }
  });
};
const updateWeightLog = async (logId, payload) => {
  const data = WeightLogUpdateDto.parse(payload);

  return prisma.weightLog.update({
    where: { id: logId },
    data: {
      weightKg: data.weightKg,
      notes: data.notes ?? null
    }
  });
};

module.exports = {
  createWeightLog,
  listWeightHistory,
  updateWeightLog
};

