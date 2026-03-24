export const nutritionKeys = {
  root: () => ["nutrition"] as const,
  plans: () => [...nutritionKeys.root(), "plans"] as const,
  plan: (dayType: "training" | "rest") => [...nutritionKeys.plans(), dayType] as const,
  meal: (mealId: string) => [...nutritionKeys.root(), "meal", mealId] as const,
  actions: () => [...nutritionKeys.root(), "actions"] as const
};
