const A = require('../services/auth.service');
const { AppError } = require('../common/errors');

/**
 * INTERNAL ONLY
 * POST /internal/auth/register
 */
const registerUser = async (req, res, next) => {
  try {
    const result = await A.registerUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * POST /internal/auth/login
 */
const login = async (req, res, next) => {
  try {
    const result = await A.login({
      email: req.body.email,
      password: req.body.password,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // === קריטי: להוסיף כאן ===
    res.cookie("access_token", result.tokens.accessToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,   // local only
      path: "/",       
      domain: "localhost",
    });

    res.status(200).json(result);

  } catch (err) {
    next(err);
  }
};


/**
 * INTERNAL ONLY
 * POST /internal/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    const { sessionId } = req.body; // gateway שולח sessionId
    await A.logout({ sessionId });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * POST /internal/auth/mfa/verify
 */
const verifyMFA = async (req, res, next) => {
  try {
    const { userId, code, deviceId } = req.body;
    const ok = await A.verifyMFA(userId, code, deviceId);
    if (!ok) throw new AppError(401, 'MFA verification failed');
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * POST /internal/auth/mfa/register
 */
const registerMFADevice = async (req, res, next) => {
  try {
    const { userId, type } = req.body;
    const device = await A.registerMFADevice(userId, type);
    res.json(device);
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * POST /internal/auth/token/refresh
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await A.refreshToken(refreshToken);
    res.json(tokens);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  registerUser,
  login,
  logout,
  verifyMFA,
  registerMFADevice,
  refresh
};
