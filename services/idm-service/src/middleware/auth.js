// middleware/auth.js
const jwt = require('jsonwebtoken');
const { prisma } = require('../db/prisma');
const { isAccessTokenRevoked } = require('../common/auth.cache');
const { AppError } = require('../common/errors');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

/**
 * Validates any JWT (access or refresh).
 * Throws AppError(401) if invalid.
 */
const validateToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    throw new AppError(401, 'Invalid token');
  }
};

/**
 * Middleware — checks Authorization header for Bearer <accessToken>.
 * Verifies signature, ensures session is valid, attaches req.auth.
 */
const authRequired = async (req, res, next) => {
  try {
    const header = req.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token)
      throw new AppError(401, 'Missing token');

    const payload = validateToken(token);
    if (payload.typ !== 'access')
      throw new AppError(401, 'Invalid token type');

    const session = await prisma.session.findUnique({ where: { id: payload.sid } });
    if (!session || session.status !== 'active' || new Date(session.expiresAt) < new Date()) {
      throw new AppError(401, 'Session expired');
    }

    if (await isAccessTokenRevoked(session.id)) {
      throw new AppError(401, 'Token revoked');
    }

    req.auth = { sessionId: payload.sid, accessToken: token, userId: payload.sub, role: payload.role };
    next();
  } catch (e) {
    next(e instanceof AppError ? e : new AppError(401, 'Invalid token'));
  }
};

module.exports = { authRequired, validateToken };
