// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../common/errors');

// Fail fast if no secret is supplied. Both services must share this.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured for workout-service');
}

const authRequired = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || '';
    // Remove the `Bearer ` prefix
    let token = header.startsWith('Bearer ') ? header.slice(7) : null;

    // Remove surrounding quotes if present (Swagger sometimes adds them)
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (!token) {
      throw new AppError(401, 'Missing token');
    }

    // Verify signature and expiration; will throw on error
    const payload = jwt.verify(token, JWT_SECRET);

    // OPTIONAL: ensure this is an access token, not a refresh token
    if (payload.typ && payload.typ !== 'access') {
      throw new AppError(401, 'Invalid token type');
    }

    // Attach claims to the request
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