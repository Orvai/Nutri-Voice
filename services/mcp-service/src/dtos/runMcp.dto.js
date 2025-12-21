import { z } from "zod";

export const RunMcpDto = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  sender: z.enum(["CLIENT", "COACH"]),
});
