/**
 * @openapi
 * tags:
 *   - name: Auth
 *   - name: Clients
 *   - name: Users
 */
import axios from "axios";
import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";
import { attachUser } from "../middleware/attachUser.js";
import { requireCoach } from "../middleware/requireRole.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

r.use(attachUser);

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



/* ======================================================
   CLIENT LIST AGGREGATION
====================================================== */

/**
 * @openapi
 * /api/clients:
 *   get:
 *     tags: [Clients]
 *     summary: Get list of enriched client profiles for coach
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientsListResponseDto"
 */
r.get("/clients", authRequired, requireCoach, async (req, res, next) => {
  try {
    const usersRes = await axios.get(`${BASE}/internal/users`, {
      headers: {
        "x-internal-token": process.env.INTERNAL_TOKEN,
      },
    });

    // --- FIX: normalize IDM response ---
    let rawUsers = [];
    if (Array.isArray(usersRes.data)) {
      rawUsers = usersRes.data;
    } else if (Array.isArray(usersRes.data?.data)) {
      rawUsers = usersRes.data.data;
    } else {
      console.error("❌ Unexpected IDM response format:", usersRes.data);
    }

    const enriched = await Promise.all(
      rawUsers.map(async (user) => {
        const infoRes = await axios.get(`${BASE}/internal/users/${user.id}/info`, {
          headers: {
            "x-internal-token": process.env.INTERNAL_TOKEN,
          },
        });


        const info =
          Array.isArray(infoRes.data) ? infoRes.data[0] :
          infoRes.data?.data ?? {};

        const prefs = info.preferences ?? {};
        console.log("🔥 IDM USER INFO RAW:", info);


        return {
          id: user.id,
          name:
            [user.firstName, user.lastName].filter(Boolean).join(" ") ||
            user.email ||
            user.phone ||
            "לא צוין",
          phone: user.phone || "",
          email: user.email || "",
          profileImageUrl: info.profileImageUrl ?? null,
          gender: info.gender ?? null,
          age: info.age ?? null,
          height: info.height ?? null,
          weight: info.weight ?? prefs.weight ?? null,
          goals: info.goals ?? prefs.goals ?? null,
          activityLevel: info.activityLevel ?? prefs.activityLevel ?? null,
          creationDate: info.createdAt || user.createdAt || null,
          city: info.city ?? null,
          address: info.address ?? null,
        };
      })
    );

    return res.json({ data: enriched });
  } catch (err) {
    console.error("❌ Error in /api/clients:", err?.response?.data || err.message);
    next(err);
  }
});


/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Get raw client info from IDM
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client data retrieved
 */
r.get("/clients/:id", authRequired, forward(BASE, "/internal/users/:id"));



/* ======================================================
   USER INFO (forwarded)
====================================================== */

/**
 * @openapi
 * /api/users/{id}/info:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get full user info
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User info retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserInfoResponseDto"
 */
r.get("/users/:id/info", authRequired, forward(BASE, "/internal/users/:id/info"));

/**
 * @openapi
 * /api/users/{id}/info:
 *   put:
 *     tags: [Users]
 *     summary: Update user info
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpsertUserInfoRequestDto"
 *     responses:
 *       200:
 *         description: User info updated
 */
r.put("/users/:id/info", authRequired, forward(BASE, "/internal/users/:id/info"));

/**
 * @openapi
 * /api/users/{id}/info:
 *   delete:
 *     tags: [Users]
 *     summary: Delete user info record
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: User info deleted
 */
r.delete("/users/:id/info", authRequired, forward(BASE, "/internal/users/:id/info"));

export default r;
