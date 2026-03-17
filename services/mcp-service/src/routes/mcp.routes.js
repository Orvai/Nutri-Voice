// src/routes/mcp.routes.js
import { Router } from "express";
import { RunMcpDto } from "../dtos/runMcp.dto.js";
import { runMcp } from "../services/mcp.service.js";
import { verifyInternalToken } from "../middleware/verifyInternalToken.js";
import {
  applyTrustedActorToRunMcpInput,
  validateTrustedActorForRunMcpInput,
} from "../security/trustedIdentity.js";
import { logger } from "../utils/logger.js";

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
      const input = RunMcpDto.parse(req.body);
      logger.info("MCP /run request", {
        conversationId: input.conversationId,
        messageId: input.messageId,
        sender: input.sender,
        clientId: input.clientId,
        contentType: input.contentType,
        historyCount: input.history.length,
      });

      const trustedActor = req.trustedActor;

      const identityCheck = validateTrustedActorForRunMcpInput(input, trustedActor);
      if (!identityCheck.ok) {
        return res.status(403).json({ message: identityCheck.error });
      }

      const trustedInput = applyTrustedActorToRunMcpInput(input, trustedActor);
      const result = await runMcp(trustedInput);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
);

export default r;
