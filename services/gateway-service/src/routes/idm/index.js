import { Router } from "express";
import { attachUser } from "../../middleware/attachUser.js";
import authRoutes from "./auth.routes.js";
import usersRoutes from "./users.routes.js";
import clientsRoutes from "./clients.routes.js";

const r = Router();

r.use(attachUser);
r.use(authRoutes);
r.use(usersRoutes);
r.use(clientsRoutes);

export default r;