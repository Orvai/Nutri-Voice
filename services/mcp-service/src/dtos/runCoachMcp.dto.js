import { z } from "zod";

export const RunCoachMcpDto = z.object({
  conversationId: z.string().min(1),
  messageId: z.string().min(1),
  sender: z.literal("coach").optional().default("coach"),
  userId: z.string().min(1),
  clientId: z.string().min(1).nullable().optional().default(null),
  userText: z.string().min(1),
  history: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      })
    )
    .optional()
    .default([]),
  requestAudit: z
    .object({
      requestId: z.string().min(1),
      actorId: z.string().min(1),
      clientId: z.string().nullable().optional(),
      toolName: z.string().nullable().optional(),
    })
    .optional(),
  metadata: z.record(z.any()).optional().default({}),
});
