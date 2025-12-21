// dto/tools/menuContext.dto.js
import { z } from "zod";

export const MenuContextDto = z.object({
  menuId: z.string(),
  name: z.string(),
  dayType: z.string(),

  notes: z.string().nullable(),

  meals: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      notes: z.string().nullable(),
      totalCalories: z.number(),

      options: z.array(
        z.object({
          id: z.string(),
          name: z.string().nullable(),

          items: z.array(
            z.object({
              foodItemId: z.string(),
              foodName: z.string(),
              role: z.string(),
              grams: z.number(),
              caloriesPer100g: z.number().nullable(),
            })
          ),
        })
      ),
    })
  ),

  vitamins: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      notes: z.string().nullable(),
    })
  ),
});
