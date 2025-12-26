const { DailyStateDto } = require('../dto/dailyState.dto');
const { getDailyState } = require('../services/dailyState.service');

const getDailyStateController = async (req, res, next) => {
  try {
    const clientId = req.user.id;
    const data = await getDailyState(clientId);

    res.json({
      data: DailyStateDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { getDailyState: getDailyStateController };
