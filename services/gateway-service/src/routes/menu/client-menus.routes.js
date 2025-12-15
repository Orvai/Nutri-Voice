import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireOwnership } from "../../middleware/requireOwnership.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

/* ======================================================
   CLIENT MENUS
====================================================== */

/**
 * @openapi
 * /api/client-menus:
 *   get:
 *     tags: [Client Menus]
 *     summary: List client menus (coach or client)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client menus list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.get("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   get:
 *     tags: [Client Menus]
 *     summary: Get client menu by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client menu retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 *       404:
 *         description: Client menu not found
 */
r.get("/client-menus/:id",authRequired,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus:
 *   post:
 *     tags: [Client Menus]
 *     summary: Create a new client menu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuCreateRequestDto"
 *     responses:
 *       201:
 *         description: Client menu created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.post("/client-menus",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   put:
 *     tags: [Client Menus]
 *     summary: Update client menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Client menu updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 *       404:
 *         description: Client menu not found
 */
r.put("/client-menus/:id",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   delete:
 *     tags: [Client Menus]
 *     summary: Deactivate client menu
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client menu deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
r.delete("/client-menus/:id",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus/from-template:
 *   post:
 *     tags: [Client Menus]
 *     summary: Create client menu from template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuCreateFromTemplateRequestDto"
 *     responses:
 *       201:
 *         description: Client menu created from template
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.post(
  "/client-menus/from-template",
  authRequired,
  requireCoach,
  (req, res, next) => {
    const { clientId, templateMenuId } = req.body ?? {};

    if (!clientId) {
      return res.status(400).json({ message: "clientId is required (context)" });
    }

    if (!templateMenuId) {
      return res.status(400).json({ message: "templateMenuId is required" });
    }

    req.headers["x-coach-id"] = req.user.id;
    req.headers["x-client-id"] = clientId;

    delete req.body.clientId;

    return forward(
      BASE,
      "/internal/menu/client-menus/from-template"
    )(req, res, next);
  }
);

export default r;
