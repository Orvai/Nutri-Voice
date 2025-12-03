// gateway/src/routes/auth.routes.js
import { Router } from "express";
import * as Auth from "../controllers/auth.controller.js";
import { getMe } from "../controllers/authProfile.controller.js";
import { verifyJwt } from "../middleware/verifyJwt.js";



const r = Router();

/* ------------------------
        AUTH ROUTES
------------------------- */

// Login
r.post("/auth/login", Auth.login);

// Register
r.post("/auth/register", Auth.register);

// Refresh access token
r.post("/auth/refresh", Auth.refresh);

// Logout
r.post("/auth/logout", Auth.logout);

// Get current logged-in user (Profile)
r.get("/auth/me", verifyJwt, getMe);

export default r;
