const { z } = require("zod");

// --- Vitamins ---
const TemplateMenuVitaminDto = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const TemplateMenuVitaminUpdateDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
});

const TemplateMenuVitaminDeleteDto = z.object({
  id: z.string(),
});

// --- Meal options ---
const TemplateMenuMealOptionDto = z.object({
  mealTemplateId: z.string(),
  name: z.string().optional(),      // "אופציה א", "אופציה ב"
  orderIndex: z.number().optional() // סדר בין האופציות
});

const TemplateMenuMealOptionUpdateDto = z.object({
  id: z.string(),
  mealTemplateId: z.string().optional(),
  name: z.string().optional(),
  orderIndex: z.number().optional(),
});

const TemplateMenuMealOptionDeleteDto = z.object({
  id: z.string(),
});

// --- Meals ---
const TemplateMenuMealDto = z.object({
  name: z.string().min(1), // "ארוחה 1", "העמסת פחמימות"
  selectedOptionId: z.string().optional(), // ברירת מחדל (לא חובה ביצירה)
  options: z.array(TemplateMenuMealOptionDto).min(1),
});

const TemplateMenuMealUpdateDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  selectedOptionId: z.string().optional(),

  optionsToAdd: z.array(TemplateMenuMealOptionDto).optional(),
  optionsToUpdate: z.array(TemplateMenuMealOptionUpdateDto).optional(),
  optionsToDelete: z.array(TemplateMenuMealOptionDeleteDto).optional(),
});

const TemplateMenuMealDeleteDto = z.object({
  id: z.string(),
});

// --- Create ---
const TemplateMenuCreateDto = z.object({
  coachId: z.string(),
  name: z.string().min(2),
  dayType: z.enum(["TRAINING", "REST"]),
  notes: z.string().optional(),

  meals: z.array(TemplateMenuMealDto).optional(),
  vitamins: z.array(TemplateMenuVitaminDto).optional(),
});

// --- Update ---
const TemplateMenuUpdateDto = z.object({
  name: z.string().optional(),
  dayType: z.enum(["TRAINING", "REST"]).optional(),
  notes: z.string().optional(),

  mealsToAdd: z.array(TemplateMenuMealDto).optional(),
  mealsToUpdate: z.array(TemplateMenuMealUpdateDto).optional(),
  mealsToDelete: z.array(TemplateMenuMealDeleteDto).optional(),

  vitaminsToAdd: z.array(TemplateMenuVitaminDto).optional(),
  vitaminsToUpdate: z.array(TemplateMenuVitaminUpdateDto).optional(),
  vitaminsToDelete: z.array(TemplateMenuVitaminDeleteDto).optional(),
});

module.exports = {
  TemplateMenuCreateDto,
  TemplateMenuUpdateDto,
};
