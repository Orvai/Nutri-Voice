import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.js";

// Routes Imports
import menuRoutes from "./routes/menu/index.js";
import workoutRoutes from "./routes/workout/index.js";
import trackingRoutes from "./routes/tracking/index.js";
import idmGatewayRoutes from "./routes/idm/index.js";
import conversationRoutes from "./routes/conversation/index.js";
import webhookRoutes from "./routes/conversation/webhook.routes.js";

// Middleware Imports
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyJwt } from "./middleware/verifyJwt.js";
import { verifyInternalToken } from "./middleware/verifyInternalToken.js";
import logger from "./middleware/logger.js";

const app = express();

// 1. Basic Middleware
app.use(
  cors({
    origin: "http://localhost:8081", 
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs-json", (req, res) => res.json(swaggerSpec));

// 3. Security Middleware Layer 1: Internal Token
app.use(verifyInternalToken);

// 4. Webhooks (Special Case)
app.use("/api/webhook", webhookRoutes);

// 5. Security Middleware Layer 2: User JWT
app.use(verifyJwt);

// 6. Application Routes
app.use("/api", menuRoutes);         
app.use("/api/workout", workoutRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api", idmGatewayRoutes); 
app.use("/api", conversationRoutes);

// 7. Error Handler (Always Last)
app.use(errorHandler);

export default app;