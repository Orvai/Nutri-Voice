const { setDayType, getTodayDayType } = require('../services/daySelection.service');
const { DaySelectionCreateDto } = require('../dto/daySelection.dto');


/**
 * @openapi
 * /api/tracking/day-selection:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Set the training or nutrition day type for a client
 *     description: Assigns a day type (LOW, HIGH, MEDIUM, or REST) for the specified date. Defaults to today when date is omitted.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DaySelectionCreateDto'
 *     responses:
 *       201:
 *         description: Day type saved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DaySelectionCreateDto'
 */
const setDayTypeController = async (req, res, next) => {
  try {
    const { clientId, dayType, date } = DaySelectionCreateDto.parse(req.body);
    const data = await setDayType(clientId, dayType, date);
    res.status(201).json({ message: 'Day type saved', data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/day-selection/today:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get today's day type for a client
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current day selection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/DaySelectionCreateDto'
 */
const getToday = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await getTodayDayType(clientId);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports = { setDayType: setDayTypeController, getToday };