const dailyStateService = require('../services/dailyState.service');

const resolveTargetClientId = (req) => {
  const actorId = req.user?.id;
  const role = String(req.user?.role || '').toLowerCase();
  const requestedClientId = typeof req.query?.clientId === 'string' ? req.query.clientId.trim() : '';

  if (role === 'coach' && requestedClientId) {
    return requestedClientId;
  }

  return actorId;
};

/**
 * GET /api/daily-state/range
 * Query Params: ?startDate=2024-01-01&endDate=2024-01-07
 */
const getRangeState = async (req, res, next) => {
  try {
    const clientId = resolveTargetClientId(req);
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'startDate and endDate are required' });
    }

    if (!clientId) {
      return res.status(400).json({ error: 'clientId could not be resolved' });
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
    const clientId = resolveTargetClientId(req);
    if (!clientId) {
      return res.status(400).json({ error: 'clientId could not be resolved' });
    }
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
