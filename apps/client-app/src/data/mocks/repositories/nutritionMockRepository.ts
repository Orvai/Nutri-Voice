import { getMockState, updateMockState } from "@/data/mocks/mockStore";
import { mockRequest } from "@/data/mocks/mockRequest";
import type {
  NutritionDayTypeDto,
  NutritionPlanDto,
  ReportMealInputDto,
  SetDayTypeInputDto
} from "@/types/nutrition/nutrition.dto";

const resolveDayType = (
  dayType: NutritionDayTypeDto | undefined
): NutritionDayTypeDto => {
  if (dayType) {
    return dayType;
  }

  const state = getMockState();
  return state.nutrition.selectedDayType;
};

const readPlan = (dayType?: NutritionDayTypeDto): NutritionPlanDto => {
  const state = getMockState();
  const resolved = resolveDayType(dayType);
  const plan = state.nutrition.plans[resolved];

  if (!plan) {
    throw new Error("לא נמצאה תוכנית תזונה ליום שנבחר");
  }

  return plan;
};

export async function getNutritionPlan(
  dayType?: NutritionDayTypeDto
): Promise<NutritionPlanDto> {
  return mockRequest("nutrition", () => readPlan(dayType));
}

export async function setNutritionDayType(
  payload: SetDayTypeInputDto
): Promise<NutritionPlanDto> {
  return mockRequest("nutrition", () => {
    updateMockState((draft) => {
      draft.nutrition.selectedDayType = payload.dayType;
    });

    return readPlan(payload.dayType);
  });
}

export async function reportMeal(
  payload: ReportMealInputDto
): Promise<NutritionPlanDto> {
  return mockRequest("nutrition", () => {
    updateMockState((draft) => {
      const plan = draft.nutrition.plans[payload.dayType];
      const meal = plan.meals.find((item) => item.id === payload.mealId);

      if (!meal) {
        throw new Error("הארוחה שבחרת לא נמצאה בתפריט");
      }

      const productExists = meal.options.some(
        (option) => option.id === payload.productId
      );

      if (!productExists) {
        throw new Error("אפשר לבחור רק מוצר מתוך הרשימה של המאמן");
      }

      if (payload.grams <= 0) {
        throw new Error("בחר משקל תקין לדיווח");
      }

      meal.logged = {
        productId: payload.productId,
        grams: payload.grams,
        loggedAtIso: new Date().toISOString()
      };
    });

    return readPlan(payload.dayType);
  });
}

export async function logWater(amountMl: number): Promise<NutritionPlanDto> {
  return mockRequest("nutrition", () => {
    if (amountMl <= 0) {
      throw new Error("כמות מים לא תקינה");
    }

    updateMockState((draft) => {
      draft.nutrition.plans.training.waterMl += amountMl;
      draft.nutrition.plans.rest.waterMl += amountMl;
    });

    return readPlan();
  });
}

export async function quickAddCalories(amount: number): Promise<NutritionPlanDto> {
  return mockRequest("nutrition", () => {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("כמות הקלוריות אינה תקינה");
    }

    const selectedDayType = getMockState().nutrition.selectedDayType;

    updateMockState((draft) => {
      draft.nutrition.plans[selectedDayType].manualCalories += amount;
    });

    return readPlan(selectedDayType);
  });
}

export async function getMealById(
  mealId: string,
  dayType?: NutritionDayTypeDto
) {
  return mockRequest("nutrition", () => {
    const plan = readPlan(dayType);
    return plan.meals.find((meal) => meal.id === mealId) ?? null;
  });
}
