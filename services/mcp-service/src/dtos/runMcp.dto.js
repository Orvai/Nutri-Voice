import { z } from "zod";

export const RunMcpDto = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  sender: z.enum(["client", "coach"]),
  clientId: z.string(),
  userId: z.string().optional(),
});
