import { Router } from "express";
import clientMcpRoutes from "../client/routes/mcpClient.routes.js";
import coachMcpRoutes from "../coach/routes/mcpCoach.routes.js";

const r = Router();

r.use(clientMcpRoutes);
r.use("/coach", coachMcpRoutes);

export default r;
