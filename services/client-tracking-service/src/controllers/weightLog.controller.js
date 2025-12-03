const { createWeightLog, listWeightHistory } = require('../services/weightLog.service');
const { WeightLogCreateDto } = require('../dto/weightLog.dto');

/**
 * @openapi
 * /api/tracking/weight-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log a client's weight
 *     description: Records a weight entry for a client. Defaults to today's date when not provided.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WeightLogCreateDto'
 *     responses:
 *       201:
 *         description: Weight logged
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/WeightLogCreateDto'
 */
const createWeight = async (req, res, next) => {
  try {
    const { clientId, ...payload } = WeightLogCreateDto.parse(req.body);
    const data = await createWeightLog({ ...payload, clientId });
    res.status(201).json({ message: 'Weight logged', data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/weight-log/history:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: List weight history for a client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Weight history ordered by date
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WeightLogCreateDto'
 */
const history = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await listWeightHistory(clientId);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports = { createWeight, history };