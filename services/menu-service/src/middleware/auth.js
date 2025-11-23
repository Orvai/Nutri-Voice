// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../common/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

// Validate JWT and attach user info to req.auth
const authRequired = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new AppError(401, 'Missing token');
    }

    const payload = jwt.verify(token, JWT_SECRET);

    // Attach user data from token
    req.auth = {
      sessionId: payload.sid,
      userId: payload.sub,
      role: payload.role,
      accessToken: token
    };

    next();
  } catch (err) {
    next(new AppError(401, 'Invalid token'));
  }
};

module.exports = { authRequired };
