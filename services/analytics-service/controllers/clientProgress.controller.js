const ClientProgressService = require("../../services/analytics/clientProgress.service");

module.exports.getClientProgress = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const range = Number(req.query.range) || 180;

    const result = await ClientProgressService.getClientProgress(
      clientId,
      range
    );

    return res.json(result);
  } catch (err) {
    next(err);
  }
};
