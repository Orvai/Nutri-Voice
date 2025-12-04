import { Router } from "express";
import { authRequired } from "../middleware/authRequired.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

// GET /api/clients → forwarded to client-service
r.get("/", authRequired, forward(BASE, "/internal/users"));

// GET /api/clients/:id
r.get("/:id", authRequired, forward(BASE, "/internal/users/:id"));

// POST /api/clients
r.post("/", authRequired, forward(BASE, "/internal/users"));

// PUT /api/clients/:id
r.put("/:id", authRequired, forward(BASE, "/internal/users/:id"));

// DELETE /api/clients/:id
r.delete("/:id", authRequired, forward(BASE, "/internal/users/:id"));

export default r;
