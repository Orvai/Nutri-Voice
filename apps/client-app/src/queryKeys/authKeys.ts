export const authKeys = {
  root: () => ["auth"] as const,
  session: () => [...authKeys.root(), "session"] as const,
  login: () => [...authKeys.root(), "login"] as const,
  forgotPassword: () => [...authKeys.root(), "forgotPassword"] as const
};
