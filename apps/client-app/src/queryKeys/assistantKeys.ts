export const assistantKeys = {
  root: () => ["assistant"] as const,
  state: () => [...assistantKeys.root(), "state"] as const,
  quickActions: () => [...assistantKeys.root(), "quickActions"] as const
};
