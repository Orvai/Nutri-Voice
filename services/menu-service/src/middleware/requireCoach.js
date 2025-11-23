// src/middleware/requireCoach.js
const { AppError } = require('../common/errors');

module.exports = (req, _res, next) => {
  if (!req.auth || req.auth.role !== 'coach') {
    return next(new AppError(403, 'Coach role required'));
  }
  next();
};
