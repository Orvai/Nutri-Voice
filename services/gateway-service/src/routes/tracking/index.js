/**
 * @openapi
 * tags:
 *   - name: Tracking
 */

import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";

import daySelectionRoutes from "./day-selection.routes.js";
import mealLogRoutes from "./meal-log.routes.js";
import workoutLogRoutes from "./workout-log.routes.js";
import weightLogRoutes from "./weight-log.routes.js";
import dailyStateRoutes from "./daily-state.routes.js";

const r = Router();

r.use(attachUser);

r.use(daySelectionRoutes);
r.use(mealLogRoutes);
r.use(workoutLogRoutes);
r.use(weightLogRoutes);
r.use(dailyStateRoutes);

export default r;
