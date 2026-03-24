export const homeKeys = {
  root: () => ["home"] as const,
  today: (userId: string) => [...homeKeys.root(), "today", userId] as const,
  quickActions: () => [...homeKeys.root(), "quickActions"] as const
};
