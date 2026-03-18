import { Router } from "express";
import { randomUUID } from "node:crypto";
import { RunCoachMcpDto } from "../../dtos/runCoachMcp.dto.js";
import { verifyInternalToken } from "../../middleware/verifyInternalToken.js";
import { runCoachMcp } from "../services/coachAssistant.service.js";

const r = Router();

r.post("/run", verifyInternalToken, async (req, res, next) => {
  try {
    const trustedActor = req.trustedActor;
    if (!trustedActor || trustedActor.role !== "coach") {
      return res.status(403).json({ message: "Coach trusted actor required" });
    }

    const input = RunCoachMcpDto.parse(req.body);
    if (input.sender !== "coach") {
      return res.status(400).json({ message: "coach sender is required" });
    }

    if (input.userId !== trustedActor.userId) {
      return res.status(403).json({ message: "Trusted actor mismatch" });
    }

    const result = await runCoachMcp({
      ...input,
      requestAudit: {
        ...(input.requestAudit || {}),
        requestId: req.headers["x-request-id"] || input.requestAudit?.requestId || randomUUID(),
        actorId: trustedActor.userId,
        clientId: input.clientId || input.requestAudit?.clientId || null,
      },
    });

    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

export default r;
