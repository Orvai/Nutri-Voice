import { Router } from "express";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.IDM_SERVICE_URL;

r.post("/auth/register", forward(BASE, "/internal/auth/register"));
r.post("/auth/login", forward(BASE, "/internal/auth/login"));
r.post("/auth/logout", forward(BASE, "/internal/auth/logout"));
r.post("/auth/token/refresh", forward(BASE, "/internal/auth/token/refresh"));
r.get("/users/:userId/info", (req, res, next) => {
    const { userId } = req.params;
    const target = `/internal/users/${userId}/info`;
    return forward(BASE, target)(req, res, next);
  });
export default r;
