// src/middleware/requireCoach.js
const { AppError } = require('../common/errors');

module.exports = (req, _res, next) => {
  if (!req.auth || req.auth.role !== 'trainer') {
    return next(new AppError(403, 'Trainer role required'));
  }
  next();
};