const ClientTodayService = require("../../services/analytics/clientToday.service");

module.exports.getClientToday = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const result = await ClientTodayService.getClientToday(clientId);

    return res.json(result);
  } catch (err) {
    next(err);
  }
};
