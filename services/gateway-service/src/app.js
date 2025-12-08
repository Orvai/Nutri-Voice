import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import menuRoutes from "./routes/menu.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import clientRoutes from "./routes/clients.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyJwt } from "./middleware/verifyJwt.js";

const app = express();

// ----------------------
// 1) CORS 
// ----------------------
app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

// ----------------------
// 2) JSON + Cookies
// ----------------------
app.use(express.json());
app.use(cookieParser());


app.use("/api", authRoutes);


// ----------------------
// 3) Auth middleware
// ----------------------
app.use(verifyJwt);

// ----------------------
// 4) Routes
// ----------------------
app.use("/api", menuRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api/clients", clientRoutes);

// ----------------------
// 5) Error Handler
// ----------------------
app.use(errorHandler);

export default app;
