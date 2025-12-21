import { z } from "zod";

export const AskCaloriesResultDto = z.object({
  replyText: z.string(),
});
