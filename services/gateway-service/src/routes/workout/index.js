/**
 * @openapi
 * tags:
 *   - name: Exercises
 *   - name: Workout Templates
 *   - name: Workout Programs
 */

import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import exercisesRoutes from "./exercises.routes.js";
import templatesRoutes from "./templates.routes.js";
import programsRoutes from "./programs.routes.js";

const r = Router();

r.use(attachUser);
r.use(exercisesRoutes);
r.use(templatesRoutes);
r.use(programsRoutes);

export default r;