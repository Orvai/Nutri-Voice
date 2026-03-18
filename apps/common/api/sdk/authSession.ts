export type AuthSessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

export type AuthFailureReason =
  | "missing_refresh_token"
  | "refresh_rejected"
  | "refresh_failed"
  | "malformed_refresh_response";

type AuthSessionListener = (tokens: AuthSessionTokens) => void;
type AuthFailureListener = (reason: AuthFailureReason) => void;

let currentTokens: AuthSessionTokens = {
  accessToken: null,
  refreshToken: null,
};

let authSessionVersion = 0;

const authSessionListeners = new Set<AuthSessionListener>();
const authFailureListeners = new Set<AuthFailureListener>();

const normalizeToken = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const notifySessionListeners = () => {
  const snapshot = { ...currentTokens };
  for (const listener of authSessionListeners) {
    listener(snapshot);
  }
};

export const getAuthSessionTokens = (): AuthSessionTokens => ({
  ...currentTokens,
});

export const getAuthSessionVersion = (): number => authSessionVersion;

export const setAuthSessionTokens = (tokens: AuthSessionTokens): void => {
  const nextTokens: AuthSessionTokens = {
    accessToken: normalizeToken(tokens.accessToken),
    refreshToken: normalizeToken(tokens.refreshToken),
  };

  const changed =
    nextTokens.accessToken !== currentTokens.accessToken ||
    nextTokens.refreshToken !== currentTokens.refreshToken;

  if (!changed) return;

  currentTokens = nextTokens;
  authSessionVersion += 1;
  notifySessionListeners();
};

export const clearAuthSessionTokens = (): void => {
  setAuthSessionTokens({ accessToken: null, refreshToken: null });
};

export const subscribeToAuthSession = (
  listener: AuthSessionListener
): (() => void) => {
  authSessionListeners.add(listener);
  listener({ ...currentTokens });

  return () => {
    authSessionListeners.delete(listener);
  };
};

export const onAuthFailure = (
  listener: AuthFailureListener
): (() => void) => {
  authFailureListeners.add(listener);

  return () => {
    authFailureListeners.delete(listener);
  };
};

export const notifyAuthFailure = (reason: AuthFailureReason): void => {
  for (const listener of authFailureListeners) {
    listener(reason);
  }
};
