const { z } = require('zod');
const { upsertMetricsLog, listMetricsHistory } = require('../services/metricsLog.service');
const {MetricsLogCreateDto,MetricsLogResponseDto,MetricsHistoryResponseDto} = require('../dto/metricsLog.dto');

const ClientIdParamsDto = z.object({ clientId: z.string().min(1) }).strict();

const logMetrics = async (req, res, next) => {
  try {
    const payload = MetricsLogCreateDto.parse(req.body);
    const clientId = req.user.id; 

    const data = await upsertMetricsLog(clientId, payload);

    res.status(201).json({
      message: 'Metrics logged',
      data: MetricsLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

const history = async (req, res, next) => {
  try {
    const { clientId } = ClientIdParamsDto.parse(req.params);
    
    const start = req.query.start ? new Date(req.query.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = req.query.end ? new Date(req.query.end) : new Date();

    const data = await listMetricsHistory(clientId, start, end);

    res.json({
      data: MetricsHistoryResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  logMetrics,
  history
};