// gateway/src/routes/clients.routes.js
import { Router } from "express";
import { verifyJwt } from "../middleware/verifyJwt.js";
import { listClients } from "../controllers/clients.controller.js";

const r = Router();
r.get("/", verifyJwt, listClients);

export default r;
