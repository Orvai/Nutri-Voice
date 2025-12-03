// src/dto/menu/clientMenu.dto.js
import { z } from "zod";

/* ========= CREATE ========= */

export const ClientMenuCreateDto = z.object({
  clientId: z.string(),
  name: z.string().min(2),
  totalCalories: z.number().optional(),
  meals: z
    .array(
      z.object({
        name: z.string(),
        items: z.array(
          z.object({
            foodId: z.string(),
            grams: z.number().positive(),
          })
        ),
      })
    )
    .optional(),
});

/* ========= UPDATE ========= */

export const ClientMenuUpdateDto = z.object({
  name: z.string().optional(),
  totalCalories: z.number().optional(),
  meals: z
    .array(
      z.object({
        name: z.string(),
        items: z.array(
          z.object({
            foodId: z.string(),
            grams: z.number().positive(),
          })
        ),
      })
    )
    .optional(),
});

/* ========= FROM TEMPLATE ========= */

export const ClientMenuFromTemplateDto = z.object({
  clientId: z.string(),
  templateMenuId: z.string(),
});

/* ========= QUERY ========= */

export const ClientMenuListQueryDto = z.object({
  clientId: z.string().optional(),
});
