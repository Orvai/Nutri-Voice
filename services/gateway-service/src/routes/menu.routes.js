import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireCoach } from "../middleware/requireRole.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

// =====================
// FOOD
// =====================

// רשימת מאכלים – מותר גם למאמן וגם למתאמן
r.get("/food", authRequired, forward(BASE, "/internal/menu/food"));
r.get("/food/search", authRequired, forward(BASE, "/internal/menu/food/search"));
r.get("/food/by-category", authRequired, forward(BASE, "/internal/menu/food/by-category"));

// יצירה/עדכון/מחיקה – רק מאמן
r.post("/food", authRequired, requireCoach, forward(BASE, "/internal/menu/food"));
r.put("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));
r.delete("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));

// =====================
// MEAL TEMPLATES
// =====================

// צפייה – מאמן בלבד (או שתרצה גם ללקוח? כרגע שמתי מאמן)
r.get("/templates", authRequired, requireCoach, forward(BASE, "/internal/menu/templates"));
r.get("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));

// יצירה/עדכון/מחיקה – מאמן בלבד
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

// פה אפשר לשקול לאפשר גם למתאמן וגם למאמן - אז בעתיד תשתמש ב-requireCoachOrClient
r.get("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));
r.get("/client-menus/:id", authRequired, forward(BASE, "/internal/menu/client-menus/:id"));

r.post("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));
r.put("/client-menus/:id", authRequired, forward(BASE, "/internal/menu/client-menus/:id"));
r.delete("/client-menus/:id", authRequired, forward(BASE, "/internal/menu/client-menus/:id"));

r.post(
  "/client-menus/from-template",
  authRequired,
  forward(BASE, "/internal/menu/client-menus/from-template")
);

export default r;
