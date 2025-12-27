import { Router } from "express";
import dailyStateRoutes from "./daily-state.routes.js";
import mealLogRoutes from "./meal-log.routes.js";
import workoutLogRoutes from "./workout-log.routes.js";
import weightLogRoutes from "./weight-log.routes.js";
import metricsLogRoutes from "./metrics-Log.routes.js";


const r = Router();

r.use(dailyStateRoutes);
r.use(mealLogRoutes);
r.use(workoutLogRoutes);
r.use(weightLogRoutes);
r.use(metricsLogRoutes);


export default r;