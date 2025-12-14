const { z } = require('zod');
const { createWeightLog, listWeightHistory } = require('../services/weightLog.service');
const {
  WeightLogCreateDto,
  WeightLogResponseDto,
  WeightHistoryResponseDto
} = require('../dto/weightLog.dto');

const ClientIdParamsDto = z.object({ clientId: z.string().min(1) }).strict();

const createWeight = async (req, res, next) => {
  try {
    const payload = WeightLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createWeightLog(clientId, payload);

    res.status(201).json({
      message: 'Weight logged',
      data: WeightLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

const history = async (req, res, next) => {
  try {
    const { clientId } = ClientIdParamsDto.parse(req.params);
    const data = await listWeightHistory(clientId);

    res.json({
      data: WeightHistoryResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { createWeight, history };