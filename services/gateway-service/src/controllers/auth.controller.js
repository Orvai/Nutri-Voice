// gateway/src/controllers/auth.controller.js
import * as idm from "../adapters/idm.adapter.js";
import { LoginRequestDto } from "../dtos/auth.dto.js";
import { logger } from "../middleware/logger.js";

const REFRESH_COOKIE_NAME = "refreshToken";

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login user
 *     description: Authenticate a user and return access token + basic user details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 */
export async function login(req, res, next) {
  try {
    const payload = LoginRequestDto.parse(req.body);

    const result = await idm.login({
      ...payload,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    const { user } = result;
    const accessToken = result.tokens?.accessToken;
    const refreshToken = result.tokens?.refreshToken;
    
    if (!accessToken || !refreshToken) {
      logger.error("IDM login returned missing tokens");
      return res.status(500).json({ message: "Invalid response from IDM" });
    }

    // Store refresh token in HttpOnly cookie
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/api/auth",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return res.json({
      accessToken,
      user, // basic user object
    });
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register new user
 */
export async function register(req, res, next) {
  try {
    const result = await idm.register(req.body);
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Logout user and clear refresh token
 */
export async function logout(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (refreshToken) {
      try {
        await idm.logout({ refreshToken });
      } catch (e) {
        logger.warn({ e }, "Failed to logout session in IDM");
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME, { path: "/api/auth" });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Refresh access token
 */
export async function refresh(req, res, next) {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!refreshToken) {
      return res.status(401).json({ message: "Missing refresh token" });
    }

    const result = await idm.refresh({ refreshToken });

    const { user, accessToken, refreshToken: newRefreshToken } = result;

    // update cookie if IDM returned a new refresh token
    if (newRefreshToken) {
      res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        path: "/api/auth",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
    }

    return res.json({
      user,
      accessToken,
    });
  } catch (err) {
    next(err);
  }
}
