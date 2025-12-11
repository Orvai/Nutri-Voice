const A = require('../services/auth.service');
const { AppError } = require('../common/errors');

/**
 * @openapi
 * /internal/auth/register:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Register a new user (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_RegisterRequestDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_RegisterSuccessResponseDto'
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
 * @openapi
 * /internal/auth/login:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Authenticate a user (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginResponseDto'
 *     responses:
 *       200:
 *         description: Authenticated session
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SessionResponseDto'
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
 * @openapi
 * /internal/auth/logout:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Logout a user session (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_LogoutRequestDto'
 *     responses:
 *       204:
 *         description: Session terminated
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
 * @openapi
 * /internal/auth/mfa/verify:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Verify MFA code (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_VerifyMFARequestDto'
 *     responses:
 *       200:
 *         description: MFA verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
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
 * @openapi
 * /internal/auth/mfa/register:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Register a new MFA device (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IDM_RegisterMFADeviceRequestDto'
 *     responses:
 *       200:
 *         description: Registered MFA device
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_MFADeviceResponseDto'
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
 * @openapi
 * /internal/auth/token/refresh:
 *   post:
 *     tags:
 *       - IDM - Auth
 *     summary: Refresh an access token (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Refreshed token pair
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/IDM_SessionResponseDto'
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