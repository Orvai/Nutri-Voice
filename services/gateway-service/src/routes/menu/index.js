/**
 * @openapi
 * tags:
 *   - name: Food
 *   - name: Meal Templates
 *   - name: Template Menus
 *   - name: Client Menus
 *   - name: Vitamins
 */

import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import foodRoutes from "./food.routes.js";
import templateMenusRoutes from "./template-menus.routes.js";
import clientMenusRoutes from "./client-menus.routes.js";
import vitaminsRoutes from "./vitamins.routes.js";
import mealTemplateRoute from "./mealTemplates.routes.js"

const r = Router();

r.use(attachUser);
r.use(foodRoutes);
r.use(templateMenusRoutes);
r.use(clientMenusRoutes);
r.use(vitaminsRoutes);
r.use(mealTemplateRoute);

export default r;