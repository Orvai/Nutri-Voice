import { Router } from "express";
import { z } from "zod";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { requireOwnership } from "../../middleware/requireOwnership.js";
import { runCoachAssistant } from "../../integrations/mcp/coachAssistant.client.js";
import { buildAuditContext } from "../../utils/audit.js";

const r = Router();

const CoachAssistantRunBodyDto = z
  .object({
    conversationId: z.string().min(1),
    messageId: z.string().min(1).optional(),
    sender: z.literal("coach").optional(),
    userId: z.string().min(1).optional(),
    userText: z.string().min(1),
    clientId: z.string().min(1).nullable().optional(),
    history: z
      .array(
        z.object({
          role: z.enum(["user", "assistant", "system"]),
          content: z.string(),
        })
      )
      .optional()
      .default([]),
    metadata: z.record(z.any()).optional(),
  })
  .strict();

r.post("/coach-assistant/run", authRequired, requireCoach, requireOwnership, async (req, res, next) => {
  try {
    const payload = CoachAssistantRunBodyDto.parse(req.body || {});
    const actorId = req.user?.actorId || req.user?.id;
    if (!actorId) {
      return res.status(401).json({ message: "Authenticated coach identity is missing" });
    }

    const clientId = payload.clientId || req.ownership?.clientId || null;

    const audit = buildAuditContext(req, {
      actorId,
      clientId,
    });

    const result = await runCoachAssistant({
      payload: {
        conversationId: payload.conversationId,
        messageId: payload.messageId || audit.requestId,
        sender: payload.sender || "coach",
        userId: actorId,
        clientId,
        userText: payload.userText,
        history: payload.history || [],
        requestAudit: {
          requestId: audit.requestId,
          actorId,
          clientId,
        },
        metadata: payload.metadata || {},
      },
      actor: {
        actorId,
        role: "coach",
        tenantId: req.user?.tenantId || null,
      },
      audit,
    });

    return res.json(result);
  } catch (err) {
    next(err);
  }
});

export default r;
