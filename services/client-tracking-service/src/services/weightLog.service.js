// fileName: src/services/weightLog.service.js
const { prisma } = require('../db/prisma');
const { WeightLogCreateDto, WeightLogUpdateDto } = require('../dto/weightLog.dto');

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