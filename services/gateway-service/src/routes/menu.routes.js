import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireOwnership } from "../middleware/requireOwnership.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

r.use(attachUser);

// =====================
// FOOD
// =====================

r.get("/food", authRequired, forward(BASE, "/internal/menu/food"));
r.get("/food/search", authRequired, forward(BASE, "/internal/menu/food/search"));
r.get("/food/by-category", authRequired, forward(BASE, "/internal/menu/food/by-category"));
r.post("/food", authRequired, requireCoach, forward(BASE, "/internal/menu/food"));
r.put("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));
r.delete("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));

// =====================
// MEAL TEMPLATES
// =====================

r.get("/templates", authRequired, requireCoach, forward(BASE, "/internal/menu/templates"));
r.get("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));

r.post("/templates", authRequired, requireCoach, forward(BASE, "/internal/menu/templates"));
r.put("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));
r.delete("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));

// =====================
// TEMPLATE MENUS (daily plan)
// =====================

r.get("/template-menus", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus"));
r.get("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));

r.post("/template-menus", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus"));
r.put("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));
r.delete("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));

// =====================
// CLIENT MENUS
// =====================

r.get("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));

// ✔ Client can fetch their own menu
// ✔ Coach can fetch menu for any client
r.get(
  "/client-menus/:id",
  authRequired,
  requireOwnership,   // keep
  forward(BASE, "/internal/menu/client-menus/:id")
);

// ✔ Only coach can modify or delete.
// ❌ Ownership not needed (coach manages all his clients)
r.post(
  "/client-menus",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus")
);

r.put(
  "/client-menus/:id",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus/:id")
);

r.delete(
  "/client-menus/:id",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus/:id")
);

// ✔ Creating from template → no ownership
r.post(
  "/client-menus/from-template",
  authRequired,
  requireCoach,
  (req, res, next) => {
    const { clientId, templateMenuId } = req.body ?? {};

    if (!clientId) return res.status(400).json({ message: "clientId is required" });
    if (!templateMenuId) return res.status(400).json({ message: "templateMenuId is required" });

    req.body = {
      ...req.body,
      coachId: req.user.id,
    };

    return forward(BASE, "/internal/menu/client-menus/from-template")(req, res, next);
  }
);

// =====================
// VITAMINS
// =====================
r.get("/vitamins", authRequired, forward(BASE, "/internal/menu/vitamins"));
r.post("/vitamins", authRequired, requireCoach, forward(BASE, "/internal/menu/vitamins"));

export default r;
