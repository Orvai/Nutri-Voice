const dailyStateService = require('../services/dailyState.service');

/**
 * GET /api/daily-state/range
 * Query Params: ?startDate=2024-01-01&endDate=2024-01-07
 */
const getRangeState = async (req, res, next) => {
  try {
    const { clientId } = req.user; 
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    const rangeData = await dailyStateService.getRangeState(clientId, startDate, endDate);
    
    res.json(rangeData);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/daily-state/today
 */
const getTodayState = async (req, res, next) => {
  try {
    const { clientId } = req.user;
    const state = await dailyStateService.getDailyState(clientId);
    res.json(state);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRangeState,
  getTodayState
};