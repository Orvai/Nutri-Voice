import { Router } from "express";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import clientsRoutes from "./clients.routes.js";

const r = Router();

r.use(authRoutes);
r.use(usersRoutes);
r.use(clientsRoutes);

export default r;