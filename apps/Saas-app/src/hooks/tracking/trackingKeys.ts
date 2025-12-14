export const trackingKeys = {
    daySelectionToday: (clientId: string) =>
      ["tracking", "day-selection", "today", clientId] as const,
  
    mealLogHistory: (clientId: string) =>
      ["tracking", "meal-log", "history", clientId] as const,
  
    weightLogHistory: (clientId: string) =>
      ["tracking", "weight-log", "history", clientId] as const,
  
    workoutLogHistory: (clientId: string) =>
      ["tracking", "workout-log", "history", clientId] as const,
  };
  