const { z } = require('zod');
const S = require('../services/subscription.service');
const { validateDto } = require('../common/validation');
const { createSubscriptionDto, updateSubscriptionDto } = require('../dto/subscription.dto');

const idParamDto = z.object({ id: z.string().uuid() }).strict();

const createSubscription = async (req, res, next) => {
  try {
    const payload = validateDto(createSubscriptionDto, req.body);
    const data = await S.createSubscription(payload);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const updateSubscription = async (req, res, next) => {
  try {
    const { id } = validateDto(idParamDto, req.params);
    const payload = validateDto(updateSubscriptionDto, req.body);
    const data = await S.updateSubscription(id, payload);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const deleteSubscription = async (req, res, next) => {
  try {
    const { id } = validateDto(idParamDto, req.params);
    const data = await S.deleteSubscription(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const getSubscription = async (req, res, next) => {
  try {
    const { id } = validateDto(idParamDto, req.params);
    const data = await S.getSubscription(id);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

const listSubscriptions = async (_req, res, next) => {
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