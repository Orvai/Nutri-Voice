// gateway/src/app.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import clientsRoutes from "./routes/clients.routes.js";
import menuRoutes from "./routes/menu.routes.js";

import  {verifyJwt} from "./middleware/verifyJwt.js";
import {attachUser} from "./middleware/attachUser.js";

import { registerSwagger } from "./swagger/swagger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { logger } from "./middleware/logger.js";

const app = express();

/* ------------------------------
   CORS (Expo Web Compatible)
------------------------------ */
app.use(cors({
  origin: true,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// JWT → req.userId
app.use(verifyJwt);

// Attach full user object → req.user
app.use(attachUser);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Swagger
registerSwagger(app);

// Routes
app.use("/api", authRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/menu", menuRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
