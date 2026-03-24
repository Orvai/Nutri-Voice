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
import coachRoutes from "./routes/coach/index.js";

// Middleware Imports
import { errorHandler } from "./middleware/errorHandler.js";
import { verifyJwt } from "./middleware/verifyJwt.js";
import { verifyInternalToken } from "./middleware/verifyInternalToken.js";
import { attachAuditContext } from "./middleware/attachAuditContext.js";
import logger from "./middleware/logger.js";

const app = express();

const DEFAULT_ALLOWED_ORIGIN = "http://localhost:8081";
const NGROK_HOST_REGEX = /\.ngrok(?:-free)?\.(?:app|dev|io)$/i;

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || DEFAULT_ALLOWED_ORIGIN)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

const isNgrokOrigin = (origin) => {
  if (!origin) {
    return false;
  }

  try {
    const { protocol, hostname } = new URL(origin);
    const isHttpProtocol = protocol === "http:" || protocol === "https:";
    return isHttpProtocol && NGROK_HOST_REGEX.test(hostname);
  } catch (_error) {
    return false;
  }
};

// 1. Basic Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin) || isNgrokOrigin(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(logger);
app.use(attachAuditContext);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api/docs-json", (req, res) => res.json(swaggerSpec));

// 3. Webhooks (Special Case) — before internal token check, secured by Telegram secret
app.use("/api/webhook", webhookRoutes);

// 4. Security Middleware Layer 1: Internal Token
app.use(verifyInternalToken);

// 5. Security Middleware Layer 2: User JWT
app.use(verifyJwt);

// 6. Application Routes
app.use("/api", menuRoutes);         
app.use("/api/workout", workoutRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api", idmGatewayRoutes); 
app.use("/api", conversationRoutes);
app.use("/api", coachRoutes);

// 7. Error Handler (Always Last)
app.use(errorHandler);

export default app;
