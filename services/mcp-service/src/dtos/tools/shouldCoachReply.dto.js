// dto/tools/shouldCoachReply.dto.js
import { z } from "zod";

export const ShouldCoachReplyInputDto = z.object({
  userMessage: z.string().optional(),

  dailyState: z.any().optional(),
  previewMeal: z.object({
    matchType: z.enum(["NONE", "PARTIAL", "FULL"]).optional(),
    confidence: z.number().optional(),
    warnings: z.array(z.string()).optional(),
  }).optional(),
  lastAction: z.any().optional(),

  hasUncertainty: z.boolean().optional(),
  mentionsMedical: z.boolean().optional(),
  repeatedCorrections: z.boolean().optional(),
}).strict();

export const ShouldCoachReplyResultDto = z.object({
  decision: z.enum(["AUTO_REPLY", "COACH_REPLY"]),
  reasons: z.array(z.string()),
});
