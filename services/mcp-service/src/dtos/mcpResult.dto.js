import { z } from "zod";

export const McpResultDto = z.object({
  decision: z.enum(["AUTO_REPLY", "COACH_REPLY"]),
  replyText: z.string().nullable(),
  usedTools: z.array(z.string()).default([]),
});
