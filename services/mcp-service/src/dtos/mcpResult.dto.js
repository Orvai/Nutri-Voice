import { z } from "zod";

export const McpResultDto = z.object({
  decision: z.enum(["AUTO_REPLY", "COACH_REPLY"]),
  replyText: z.string().nullable(),
  coachSuggestedReply: z.string().nullable().optional(),
  usedTools: z.array(z.string()).default([]),
});
