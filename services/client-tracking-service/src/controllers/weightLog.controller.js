const { createWeightLog, listWeightHistory } = require('../services/weightLog.service');
const {
  WeightLogCreateDto,
  WeightLogResponseDto,
  WeightHistoryResponseDto
} = require('../dto/weightLog.dto');

/**
 * @openapi
 * /api/tracking/weight-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log client's weight
 *     description: Authenticated client records weight for a date (defaults to today).
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeightLogCreateDto'
 *     responses:
 *       201:
 *         description: Weight logged successfully
 */
const createWeight = async (req, res, next) => {
  try {
    const payload = WeightLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createWeightLog({ ...payload, clientId });

    res.status(201).json({
      message: 'Weight logged',
      data: WeightLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/weight-log/history/{clientId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: List weight history for a client
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Weight history returned
 */
const history = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await listWeightHistory(clientId);

    res.json({
      data: WeightHistoryResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { createWeight, history };
