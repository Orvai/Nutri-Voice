import { z } from "zod";

export const RunMcpDto = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  
  sender: z.enum(["client", "coach"]), 
  
  clientId: z.string(),
  userId: z.string().optional(),
  

  userText: z.string().optional().default(""),

  history: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]), 
      content: z.string(),
    })
  ).optional().default([]), 
});