import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

import menuRoutes from "./routes/menu.routes.js";
import workoutRoutes from "./routes/workout.routes.js";
import trackingRoutes from "./routes/tracking.routes.js";
import idmGatewayRoutes from "./routes/idm.gateway.routes.js";
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
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ----------------------
// 3) Auth middleware
// ----------------------
app.use(verifyJwt);

// ----------------------
// 4) Swagger Docs (NEW)
// ----------------------
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ----------------------
// 5) Routes
// ----------------------
app.use("/api", menuRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api", idmGatewayRoutes);
app.use("/api/tracking", trackingRoutes);

// ----------------------
// 6) Error Handler
// ----------------------
app.use(errorHandler);

export default app;
