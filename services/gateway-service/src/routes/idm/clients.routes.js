import { Router } from "express";
import { forward } from "../../utils/forward.js";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { aggregateClients } from "./clients.aggregate.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

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
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ClientListItemDto"
 */
r.get("/clients", authRequired, requireCoach, async (req, res, next) => {
  try {
    const enriched = await aggregateClients(req, BASE);
    return res.json({ data: enriched });
  } catch (err) {
    console.error("❌ Error in /api/clients:", err?.response?.data || err);
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
 *         description: Client retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UserResponseDto"
 */
r.get("/clients/:id", authRequired, forward(BASE, "/internal/users/:id"));

export default r;
