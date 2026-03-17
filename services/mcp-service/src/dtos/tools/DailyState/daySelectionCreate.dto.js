import { z } from "zod";

export const DaySelectionCreateDto = z.object({
  dayType: z.enum(["TRAINING", "REST"], {
    errorMap: () => ({ message: "dayType must be either 'TRAINING' or 'REST'" }),
  }),
  date: z.string().datetime().optional(),
  source: z.enum(["USER_EXPLICIT", "AUTO", "COACH_SET"]).optional(),
  confidence: z.number().min(0).max(1).optional(),
  effectiveDate: z.string().datetime().optional(),
})
.strict();
