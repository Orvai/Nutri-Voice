import express from "express";
import mcpRoutes from "./routes/mcp.routes.js";
import { logger } from "./utils/logger.js";

export function createServer() {
  const app = express();
  app.use(express.json());

  app.use("/internal/mcp", mcpRoutes);

  app.use((err, _req, res, _next) => {
    logger.error("Unhandled MCP route error", {
      error: err.message,
    });
    res.status(400).json({
      message: err.message || "MCP request failed",
    });
  });

  return app;
}
