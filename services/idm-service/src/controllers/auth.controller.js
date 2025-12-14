const A = require('../services/auth.service');
const { AppError } = require('../common/errors');
const { validateDto } = require('../common/validation');
const {
  registerRequestDto,
  loginRequestDto,
  loginContextDto,
  refreshTokenDto,
} = require('../dto/auth.dto');
const { registerMFARequestDto, verifyMFARequestDto } = require('../dto/mfa.dto');

const registerUser = async (req, res, next) => {
  try {
    const payload = validateDto(registerRequestDto, req.body);
    const result = await A.registerUser(payload);
    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const credentials = validateDto(loginRequestDto, req.body);
    const context = validateDto(loginContextDto, {
      ...credentials,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || null,
    });

    const result = await A.login(context);

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

const logout = async (req, res, next) => {
  try {
    const sessionId = req.auth?.sessionId;
    if (!sessionId) {
      throw new AppError(401, 'Invalid token');
    }

    await A.logout({ sessionId });
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

const verifyMFA = async (req, res, next) => {
  try {
    const { code, deviceId } = validateDto(verifyMFARequestDto, req.body);
    const userId = req.auth?.userId;
    if (!userId) throw new AppError(401, 'Invalid token');

    const ok = await A.verifyMFA(userId, code, deviceId);
    if (!ok) throw new AppError(401, 'MFA verification failed');
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};

const registerMFADevice = async (req, res, next) => {
  try {
    const { type } = validateDto(registerMFARequestDto, req.body);
    const userId = req.auth?.userId;
    if (!userId) throw new AppError(401, 'Invalid token');

    const device = await A.registerMFADevice(userId, type);
    res.json(device);
  } catch (e) {
    next(e);
  }
};

const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = validateDto(refreshTokenDto, req.body);
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