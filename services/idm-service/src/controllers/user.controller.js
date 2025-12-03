const S = require('../services/user.service');

/**
 * INTERNAL ONLY
 * POST /internal/users
 */
const createUser = async (req, res, next) => {
  try {
    const data = await S.createUser(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * PATCH /internal/users/:userId
 */
const updateUser = async (req, res, next) => {
  try {
    const data = await S.updateUser(req.params.userId, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/users/:userId
 */
const getUser = async (req, res, next) => {
  try {
    const data = await S.getUser(req.params.userId);
    res.json(data);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/users
 */
const listUsers = async (req, res, next) => {
  try {
    const data = await S.getAllUsers();
    res.json(data);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createUser,
  updateUser,
  getUser,
  listUsers,
};
