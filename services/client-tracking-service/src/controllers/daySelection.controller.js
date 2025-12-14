const { z } = require('zod');
const { setDayType, getTodayDayType } = require('../services/daySelection.service');
const { DaySelectionCreateDto, DaySelectionResponseDto } = require('../dto/daySelection.dto');

const ClientIdParamsDto = z.object({ clientId: z.string().min(1) }).strict();

const setDayTypeController = async (req, res, next) => {
  try {
    const payload = DaySelectionCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await setDayType(clientId, payload);

    res.status(201).json({ message: 'Day type saved', data: DaySelectionResponseDto.parse(data) });
  } catch (e) {
    next(e);
  }
};

const getToday = async (req, res, next) => {
  try {
    const { clientId } = ClientIdParamsDto.parse(req.params);
    const data = await getTodayDayType(clientId);

    res.json({ data: data ? DaySelectionResponseDto.parse(data) : null });
  } catch (e) {
    next(e);
  }
};

module.exports = { setDayType: setDayTypeController, getToday };