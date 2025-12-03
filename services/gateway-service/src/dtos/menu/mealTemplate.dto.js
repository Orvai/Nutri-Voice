// src/dto/menu/mealTemplate.dto.js
import { z } from "zod";

/* ========= CREATE ========= */

export const MealTemplateCreateDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  meals: z.array(
    z.object({
      name: z.string(),
      items: z.array(
        z.object({
          foodId: z.string(),
          grams: z.number().positive(),
        })
      ),
    })
  ).optional(),
});

/* ========= UPSERT/UPDATE ========= */

export const MealTemplateUpsertDto = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
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

/* ========= QUERY ========= */

export const MealTemplateListQueryDto = z.object({
  coachId: z.string().optional(), // לא מגיע מהלקוח — יוחלף אוטומטית
});
