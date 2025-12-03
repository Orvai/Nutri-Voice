const S = require('../services/subscription.service');

/**
 * INTERNAL ONLY
 * POST /internal/subscriptions
 */
const createSubscription = async (req, res, next) => {
  try {
    const data = await S.createSubscription(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * PATCH /internal/subscriptions/:id
 */
const updateSubscription = async (req, res, next) => {
  try {
    const data = await S.updateSubscription(req.params.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * DELETE /internal/subscriptions/:id
 */
const deleteSubscription = async (req, res, next) => {
  try {
    const data = await S.deleteSubscription(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/subscriptions/:id
 */
const getSubscription = async (req, res, next) => {
  try {
    const data = await S.getSubscription(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/subscriptions
 */
const listSubscriptions = async (req, res, next) => {
  try {
    const data = await S.getAllSubscriptions();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createSubscription,
  updateSubscription,
  deleteSubscription,
  getSubscription,
  listSubscriptions,
};
