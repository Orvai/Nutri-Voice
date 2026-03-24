export const workoutKeys = {
  root: () => ["workout"] as const,
  programs: () => [...workoutKeys.root(), "programs"] as const,
  program: (id: string) => [...workoutKeys.programs(), id] as const,
  active: (id: string) => [...workoutKeys.root(), "active", id] as const,
  summary: (id: string) => [...workoutKeys.root(), "summary", id] as const
};
