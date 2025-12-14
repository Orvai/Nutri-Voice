import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

import menuRoutes from "./routes/menu/index.js";
import workoutRoutes from "./routes/workout/index.js";
import trackingRoutes from "./routes/tracking/index.js";
import idmGatewayRoutes from "./routes/idm/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyJwt } from "./middleware/verifyJwt.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8081",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(verifyJwt);

// Swagger UI
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 🔥 Swagger JSON (needed for openapi-typescript)
app.get("/api/docs-json", (req, res) => res.json(swaggerSpec));

// Routes
app.use("/api", menuRoutes);
app.use("/api/workout", workoutRoutes);
app.use("/api", idmGatewayRoutes);
app.use("/api/tracking", trackingRoutes);

// Error handler
app.use(errorHandler);

export default app;
