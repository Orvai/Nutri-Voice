import { z } from "zod";

export const CoachToolResultDto = z.object({
  ok: z.boolean(),
  entityType: z.string(),
  entityId: z.string().nullable(),
  summary: z.string(),
  data: z.any().optional(),
  meta: z.record(z.any()).default({}),
  audit: z
    .object({
      requestId: z.string().nullable().optional(),
      actorId: z.string().nullable().optional(),
      clientId: z.string().nullable().optional(),
      toolName: z.string().nullable().optional(),
    })
    .default({}),
});

export const CoachMcpResultDto = z.object({
  status: z.enum([
    "ok",
    "clarification_required",
    "out_of_scope",
    "escalation_required",
    "error",
  ]),
  replyText: z.string().nullable().default(null),
  summary: z.string(),
  resolvedClient: z
    .object({
      id: z.string(),
      name: z.string().nullable().optional(),
    })
    .nullable()
    .default(null),
  toolResults: z.array(CoachToolResultDto).default([]),
  usedTools: z.array(z.string()).default([]),
  meta: z.record(z.any()).default({}),
  audit: z
    .object({
      requestId: z.string().nullable().optional(),
      actorId: z.string().nullable().optional(),
      clientId: z.string().nullable().optional(),
      toolName: z.string().nullable().optional(),
    })
    .default({}),
});
