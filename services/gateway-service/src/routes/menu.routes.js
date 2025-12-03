// src/routes/menu.routes.js
import { Router } from "express";
import { authRequired } from "../middleware/authRequired.js";

import { requireCoach, requireClient, requireCoachOrClient } from "../middleware/requireRole.js";

import { FoodController } from "../controllers/menu/food.controller.js";
import { MealTemplateController } from "../controllers/menu/mealTemplate.controller.js";
import { TemplateMenuController } from "../controllers/menu/templateMenu.controller.js";
import { ClientMenuController } from "../controllers/menu/clientMenu.controller.js";

const r = Router();

/* ============================
   FOOD
============================ */

// Only coach can create/edit/delete
r.post("/food", authRequired, requireCoach, FoodController.create);
r.put("/food/:id", authRequired, requireCoach, FoodController.update);
r.delete("/food/:id", authRequired, requireCoach, FoodController.remove);

// Both coach & client can view / search
r.get("/food", authRequired, requireCoachOrClient, FoodController.list);
r.get("/food/search", authRequired, requireCoachOrClient, FoodController.search);
r.get("/food/by-category", authRequired, requireCoachOrClient, FoodController.byCategory);

/* ============================
   MEAL TEMPLATES (coach only)
============================ */
r.post("/templates", authRequired, requireCoach, MealTemplateController.create);
r.get("/templates", authRequired, requireCoach, MealTemplateController.list);
r.get("/templates/:id", authRequired, requireCoach, MealTemplateController.get);
r.put("/templates/:id", authRequired, requireCoach, MealTemplateController.update);
r.delete("/templates/:id", authRequired, requireCoach, MealTemplateController.remove);

/* ============================
   TEMPLATE MENUS (coach only)
============================ */
r.post("/template-menus", authRequired, requireCoach, TemplateMenuController.create);
r.get("/template-menus", authRequired, requireCoach, TemplateMenuController.list);
r.get("/template-menus/:id", authRequired, requireCoach, TemplateMenuController.get);
r.put("/template-menus/:id", authRequired, requireCoach, TemplateMenuController.update);
r.delete("/template-menus/:id", authRequired, requireCoach, TemplateMenuController.remove);

/* ============================
   CLIENT MENUS
============================ */

// Coach-only actions
r.post("/client-menus", authRequired, requireCoach, ClientMenuController.create);
r.post("/client-menus/from-template", authRequired, requireCoach, ClientMenuController.fromTemplate);
r.put("/client-menus/:id", authRequired, requireCoach, ClientMenuController.update);
r.delete("/client-menus/:id", authRequired, requireCoach, ClientMenuController.remove);

// Coach OR Client can read
r.get("/client-menus", authRequired, requireCoachOrClient, ClientMenuController.list);
r.get("/client-menus/:id", authRequired, requireCoachOrClient, ClientMenuController.get);

export default r;
