// src/routes/mcp.routes.js
import { Router } from "express";
import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { runMcp } from "../services/mcp.service.js";
import { verifyInternalToken } from "../middleware/verifyInternalToken.js";

const r = Router();

/**
 * INTERNAL ONLY
 * Conversation-service → MCP-service
 */
r.post(
  "/run",
  verifyInternalToken,
  async (req, res, next) => {
    try {
      console.log("🟣 MCP RAW BODY =", JSON.stringify(req.body, null, 2));

      const input = RunMcpDto.parse(req.body);
      const result = await runMcp(input);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default r;
