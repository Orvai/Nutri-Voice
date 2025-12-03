const I = require('../services/userInfo.service');

/**
 * INTERNAL ONLY
 * PUT /internal/users/:userId/info
 */
const upsertUserInformation = async (req, res, next) => {
  try {
    const data = await I.upsertUserInformation(req.params.userId, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/users/:userId/info
 */
const getUserInformation = async (req, res, next) => {
  try {
    const data = await I.getUserInformation(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * DELETE /internal/users/:userId/info
 */
const deleteUserInformation = async (req, res, next) => {
  try {
    const data = await I.deleteUserInformation(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  upsertUserInformation,
  getUserInformation,
  deleteUserInformation,
};
