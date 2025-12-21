// dto/tools/shouldCoachReply.dto.js
import { z } from "zod";

export const ShouldCoachReplyInputDto = z.object({
  userMessage: z.string(),

  dailyState: z.any().optional(),        
  previewMeal: z.any().optional(),       //
  lastAction: z.any().optional(),       

  hasUncertainty: z.boolean().optional(),
  mentionsMedical: z.boolean().optional(),
  repeatedCorrections: z.boolean().optional(),
});

export const ShouldCoachReplyResultDto = z.object({
  decision: z.enum(["AUTO_REPLY", "COACH_REPLY"]),
  reasons: z.array(z.string()),
});
