// src/middleware/requireClientOrCoachOwner.js
const { AppError } = require('../common/errors');

module.exports = (req, _res, next) => {
  const userId = req.auth?.userId;
  const role = req.auth?.role;

  if (!userId) {
    return next(new AppError(401, 'Unauthorized'));
  }

  // A client may only fetch his own data
  if (role === 'client') {
    if (req.query.clientId && req.query.clientId !== userId) {
      return next(new AppError(403, 'Forbidden'));
    }
  }

  // A trainer may only access menus of their own clients
  if (role === 'trainer') {
    // Valid for:
    // /client-menus
    // /client-menus/:id → handled in service
    return next();
  }

  next(new AppError(403, 'Forbidden'));
};
