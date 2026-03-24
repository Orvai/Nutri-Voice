import { z } from "zod";

export const RunMcpDto = z.object({
  conversationId: z.string(),
  messageId: z.string(),
  
  sender: z.enum(["client", "coach"]), 
  
  clientId: z.string(),
  userId: z.string().optional(),
  userGender: z.string().optional(),
  
  contentType: z.enum(["TEXT", "IMAGE", "AUDIO", "VIDEO"]).optional().default("TEXT"),
  media: z
    .object({
      mediaUrl: z.string().url(),
      mediaMimeType: z.string().optional(),
      mediaDurationSec: z.number().int().optional(),
      mediaThumbnail: z.string().optional(),
    })
    .optional(),

  userText: z.string().optional().default(""),

  history: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]), 
      content: z.string(),
    })
  ).optional().default([]), 

  requestAudit: z
    .object({
      requestId: z.string().min(1),
      actorId: z.string().min(1),
      clientId: z.string().nullable().optional(),
      toolName: z.string().nullable().optional(),
    })
    .optional(),
}).superRefine((value, ctx) => {
  if (value.sender === "coach" && !value.userId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["userId"],
      message: "userId is required when sender is coach",
    });
  }

  if (value.contentType !== "TEXT" && !value.media?.mediaUrl) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["media", "mediaUrl"],
      message: "media.mediaUrl is required for non-TEXT content",
    });
  }
});
