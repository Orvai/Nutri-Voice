export type TemplateMenuMealOption = {
    id: string;
    mealTemplateId: string;
    name?: string;
    orderIndex: number;
  };
  
  export type TemplateMenuMeal = {
    id: string;
    name: string;
    selectedOptionId?: string;
    options: TemplateMenuMealOption[];
  };
  
  export type TemplateMenuVitamin = {
    id: string;
    name: string;
    description?: string;
  };
  
  export type TemplateMenu = {
    id: string;
    coachId: string;
    name: string;
    dayType: "TRAINING" | "REST";
    notes?: string;
    totalCalories: number;
    meals: TemplateMenuMeal[];
    vitamins: TemplateMenuVitamin[];
  };
  