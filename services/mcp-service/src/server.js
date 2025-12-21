import express from "express";
import mcpRoutes from "./routes/mcp.routes.js";

export function createServer() {
  const app = express();
  app.use(express.json());

  app.use("/internal/mcp", mcpRoutes);

  return app;
}
