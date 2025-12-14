import { Router } from "express";
import { forward } from "../../utils/forward.js";
import { authRequired } from "../../middleware/authRequired.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

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
 *       204:
 *         description: Deleted successfully
 */
r.delete("/users/:id/info", authRequired, forward(BASE, "/internal/users/:id/info"));

export default r;