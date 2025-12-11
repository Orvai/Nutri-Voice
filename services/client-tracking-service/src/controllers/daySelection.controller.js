const { setDayType, getTodayDayType } = require('../services/daySelection.service');
const { DaySelectionCreateDto, DaySelectionResponseDto } = require('../dto/daySelection.dto');

/**
 * @openapi
 * /api/tracking/day-selection:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Set the training or nutrition day type for a client
 *     description: Authenticated client sets today's (or a provided date's) nutrition/training day type.
 *     security:
 *       - internalToken: []
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
 *               $ref: '#/components/schemas/DaySelectionResponseDto'
 */
const setDayTypeController = async (req, res, next) => {
  try {
    const payload = DaySelectionCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await setDayType(clientId, payload.dayType, payload.date);

    res.status(201).json({ message: 'Day type saved', data: DaySelectionResponseDto.parse(data) });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/day-selection/today/{clientId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get today's day type for a specific client
 *     description: Used by coaches to view a client's current day-selection.
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Current day selection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DaySelectionResponseDto'
 */
const getToday = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await getTodayDayType(clientId);

    res.json({ data: data ? DaySelectionResponseDto.parse(data) : null });
  } catch (e) {
    next(e);
  }
};

module.exports = { setDayType: setDayTypeController, getToday };
