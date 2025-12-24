import { z } from "zod";

export const DaySelectionCreateDto = z.object({
  dayType: z.enum(["TRAINING", "REST"], {
    errorMap: () => ({ message: "dayType must be either 'TRAINING' or 'REST'" }),
  }),
  date: z.string().datetime().optional(),
})
.strict(); 