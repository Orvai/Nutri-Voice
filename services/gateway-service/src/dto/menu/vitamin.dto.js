import { z } from "zod";

/* =============================================================================
   VITAMINS – GATEWAY DTO (ALIGNED TO menu-service)
============================================================================= */

/**
 * CREATE
 */
export const VitaminCreateRequestDto = z.object({
  name: z.string().min(1),
  description: z.string().nullable().optional(),
});

/**
 * RESPONSE (REAL microservice response)
 */
export const VitaminResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
});
