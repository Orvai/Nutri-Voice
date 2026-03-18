import { z } from "zod";

const ActiveClientSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().optional(),
  })
  .strict();

const PendingClarificationSchema = z
  .object({
    type: z.enum(["client_selection"]),
    options: z
      .array(
        z
          .object({
            id: z.string(),
            name: z.string(),
          })
          .strict()
      )
      .default([]),
  })
  .strict();

export const CoachSessionStateDto = z.object({
  activeClient: ActiveClientSchema.nullable().default(null),
  pendingClarification: PendingClarificationSchema.nullable().default(null),
  lastOverview: z
    .object({
      clientId: z.string(),
      generatedAt: z.string().datetime(),
    })
    .nullable()
    .default(null),
  updatedAt: z.string().datetime(),
});

export const CoachSessionStatePatchDto = z
  .object({
    activeClient: ActiveClientSchema.nullable().optional(),
    pendingClarification: PendingClarificationSchema.nullable().optional(),
    lastOverview: z
      .object({
        clientId: z.string(),
        generatedAt: z.string().datetime(),
      })
      .nullable()
      .optional(),
    clearKeys: z
      .array(z.enum(["activeClient", "pendingClarification", "lastOverview"]))
      .optional(),
  })
  .strict();
