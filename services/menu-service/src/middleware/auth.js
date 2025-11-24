// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { AppError } = require('../common/errors');

// Require a JWT secret; fail fast if it's missing
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured for menu-service');
}

// Validate JWT and attach user info to req.auth
const authRequired = (req, res, next) => {
  try {
    const header = req.headers['authorization'] || '';
    // Extract everything after "Bearer "
    let token = header.startsWith('Bearer ') ? header.slice(7) : null;

    // Remove wrapping quotes if they exist (e.g. Bearer "eyJ…")
    if (token && token.startsWith('"') && token.endsWith('"')) {
      token = token.slice(1, -1);
    }

    if (!token) {
      throw new AppError(401, 'Missing token');
    }

    // Verify the signature; throws if invalid or expired
    const payload = jwt.verify(token, JWT_SECRET);

    // Optional: ensure this is an access token
    if (payload.typ && payload.typ !== 'access') {
      throw new AppError(401, 'Invalid token type');
    }

    // Attach decoded claims to the request context
    req.auth = {
      sessionId: payload.sid,
      userId: payload.sub,
      role: payload.role,
      accessToken: token
    };

    next();
  } catch (err) {
    // Swallow any error and respond with generic 401
    next(new AppError(401, 'Invalid token'));
  }
};

module.exports = { authRequired };
