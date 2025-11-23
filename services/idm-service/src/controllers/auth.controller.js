const A = require('../services/auth.service');
const { AppError } = require('../common/errors');

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     description: Creates a new user account and associated credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequestDto'
 *     responses:
 *       201:
 *         description: Registration succeeded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterSuccessResponseDto'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email already exists
 */
const registerUser = async (req, res, next) => {
  try {
    const result = await A.registerUser(req.body);
    res.status(201).json({
      message: 'Successfully registered',
      id: result.id,
      role: result.role,
    });  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Authenticate a user
 *     description: |
 *       Logs a user in using email and password.
 *       On success, creates a new session, returns a short-lived access token,
 *       and stores a refresh token inside an HttpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequestDto'
 *     responses:
 *       201:
 *         description: Authentication successful — session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 sessionId:
 *                   type: string
 *                   format: uuid
 *                   description: Unique ID of the created session
 *                 tokens:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       description: Short-lived access token (JWT)
 *                   required: [accessToken]
 *               required: [user, sessionId, tokens]
 *       401:
 *         description: Invalid email or password
 *       423:
 *         description: Account locked due to too many failed login attempts
 */
const login = async (req, res, next) => {
  try {
    const result = await A.login({
      email: req.body.email,
      password: req.body.password,
      ip: req.ip,
      userAgent: req.headers['user-agent']
    });

    const { tokens, ...rest } = result;
    A.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(201).json({
      ...rest,
      tokens: { accessToken: tokens.accessToken }
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Log out of the current session
 *     description: |
 *       Logs out the currently authenticated session by revoking its access and refresh tokens.
 *       Also clears the HttpOnly refresh token cookie.
 *       Requires a valid `Authorization: Bearer <access token>` header.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logout successful — session terminated
 *       401:
 *         description: Unauthorized — missing or invalid token
 */
const logout = async (req, res, next) => {
  try {
    await A.logout({ sessionId: req.auth.sessionId });
    A.clearRefreshTokenCookie(res);
    res.status(204).send();
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/auth/mfa/verify:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Verify an MFA code
 *     description: Checks a TOTP code for the given user and device.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyMFAInput'
 *     responses:
 *       200:
 *         description: MFA verification succeeded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *               required: [ok]
 *       401:
 *         description: MFA verification failed
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
 * /api/auth/mfa/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register an MFA device
 *     description: |
 *       Registers a new TOTP device for the authenticated user
 *       and returns the secret and otpauth URL.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterMFAInput'
 *     responses:
 *       200:
 *         description: MFA device registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 device:
 *                   $ref: '#/components/schemas/MFADevice'
 *                 otpauth:
 *                   type: string
 *               required: [device, otpauth]
 */
const registerMFADevice = async (req, res, next) => {
  try {
    const userId = req.auth.userId;
    const { type } = req.body;
    res.json(await A.registerMFADevice(userId, type));
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/auth/token/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 *     description: |
 *       Exchanges a valid refresh token (sent automatically via HttpOnly cookie)
 *       for a new access/refresh token pair.
 *       The endpoint rotates the refresh token and updates the cookie.
 *     responses:
 *       200:
 *         description: New access token issued
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New short-lived access token (JWT)
 *               required: [accessToken]
 *       401:
 *         description: Invalid or expired refresh token
 */
const refresh = async (req, res, next) => {
  try {
    const refreshToken = A.getRefreshTokenFromRequest(req);
    if (!refreshToken) throw new AppError(401, 'Missing refresh token cookie');

    const tokens = await A.refreshToken(refreshToken);
    A.setRefreshTokenCookie(res, tokens.refreshToken);

    res.status(200).json({ accessToken: tokens.accessToken });
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
