// src/dto/menu/templateMenu.dto.js
import { z } from "zod";

/* ========= CREATE ========= */

export const TemplateMenuCreateDto = z.object({
  name: z.string().min(2),
  dayType: z.string(),       // כמו breakfast/lunch/dinner וכו
  totalCalories: z.number(),
  templateId: z.string().optional(), 
});

/* ========= UPDATE ========= */

export const TemplateMenuUpdateDto = z.object({
  name: z.string().optional(),
  dayType: z.string().optional(),
  totalCalories: z.number().optional(),
});

/* ========= QUERY ========= */

export const TemplateMenuListQueryDto = z.object({
  coachId: z.string().optional(), // יוחלף אוטומטית בגטווי
});
