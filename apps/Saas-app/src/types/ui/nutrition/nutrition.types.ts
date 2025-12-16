export type UINutritionSource = "template" | "client";

export type UIDayType = "TRAINING" | "REST";

export type UIMealTemplateKind =
  | "MEAT_MEAL"
  | "DAIRY_MEAL"
  | "CARB_LOAD"
  | "FREE_CALORIES"
  | "OTHER"
  | string;

export type UIFoodRole =
  | "PROTEIN"
  | "CARB"
  | "FAT"
  | "FREE"
  | "HEALTH"
  | "MENTAL_HEALTH"
  | string;

/* =========================
   ROOT PLAN
========================= */

export interface UINutritionPlan {
  id: string;
  name: string;
  source: UINutritionSource;
  dayType: UIDayType;
  totalCalories: number;
  notes: string | null;
  vitamins: UIVitamin[];
  meals: UIMeal[];
}

/* =========================
   VITAMINS
========================= */

export interface UIVitamin {
  id: string;
  vitaminId?: string | null;
  name: string;
  description: string | null;
}

/* =========================
   MEALS
========================= */

export interface UIMeal {
  id: string;
  title: string;
  timeRange: string | null;
  notes: string | null;
  totalCalories: number | null;
  selectedOptionId?: string | null;

  /** 
   * Options:
   * - template → planned options
   * - client   → executed options
   */
  options: UIMealOption[];

  /** optional legacy / UI helpers */
   /**
   * @deprecated
   * Prevents accidental recursive usage.
   */
   meals?: undefined;

   /**
    * @deprecated
    * MealTemplate relation must live on MealOption only.
    */
   mealTemplateId?: string;
}

/* =========================
   MEAL OPTIONS
========================= */

/**
 * Base option – shared
 */
interface UIBaseMealOption {
  id: string;
  title: string;
  orderIndex: number;
  isSelected: boolean;
  foods: UIFoodItem[];
}

/**
 * Template option (planning)
 */
export interface UITemplateMealOption extends UIBaseMealOption {
  mealTemplateId: string;
  mealTemplateName: string;
  mealTemplateKind: UIMealTemplateKind;
}

/**
 * Client option (execution)
 *  no template fields
 */
export interface UIClientMealOption extends UIBaseMealOption {}

/**
 * Union used by UI
 */
export type UIMealOption = UITemplateMealOption | UIClientMealOption;

/* =========================
   FOOD ITEM (UI)
========================= */

export interface UIFoodItem {
  id: string;
  foodItemId: string;
  name: string;
  role: UIFoodRole;

  /** editable truth */
  grams: number;

  /** UI only */
  color: string;
  caloriesPer100g?: number | null; // UI-only, not domain

}

/* =========================
   MENU TABS
========================= */

export type UINutritionMenuTab = {
  id: string;
  label: string;
  dayType: UIDayType;
  totalCalories: number;
};
