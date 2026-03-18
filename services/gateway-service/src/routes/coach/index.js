import { Router } from "express";
import assistantRoutes from "./assistant.routes.js";

const r = Router();

r.use(assistantRoutes);

export default r;
