import { Router } from "express";
import { forward } from "../../utils/forward.js";
import { authRequired } from "../../middleware/authRequired.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

/* ======================================================
   AUTH ROUTES
====================================================== */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequestDto"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponseDto"
 */
r.post("/auth/login", forward(BASE, "/internal/auth/login"));

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register new account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/RegisterRequestDto"
 *     responses:
 *       201:
 *         description: Account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RegisterResponseDto"
 */
r.post("/auth/register", forward(BASE, "/internal/auth/register"));

/**
 * @openapi
 * /api/auth/token/refresh:
 *   post:
 *     tags: [Auth]
 *     summary: Refresh expired access token
 *     responses:
 *       200:
 *         description: New session tokens
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RefreshTokenResponseDto"
 */
r.post("/auth/token/refresh", forward(BASE, "/internal/auth/token/refresh"));

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Logout current session
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LogoutResponseDto"
 */
r.post("/auth/logout", authRequired, forward(BASE, "/internal/auth/logout"));

/**
 * @openapi
 * /api/auth/mfa/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register MFA device
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: MFA device registered
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/MfaRegisterResponseDto"
 */
r.post("/auth/mfa/register", authRequired, forward(BASE, "/internal/auth/mfa/register"));

/**
 * @openapi
 * /api/auth/mfa/verify:
 *   post:
 *     tags: [Auth]
 *     summary: Verify MFA code
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MfaVerifyRequestDto"
 *     responses:
 *       200:
 *         description: MFA verified & session created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MfaVerifyResponseDto"
 */
r.post("/auth/mfa/verify", authRequired, forward(BASE, "/internal/auth/mfa/verify"));

export default r;