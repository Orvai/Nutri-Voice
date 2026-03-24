import React, {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import type { AuthUser, SessionTokens } from "@/types/auth/auth.ui";
import { AUTH_STORAGE_KEY } from "@/context/session/storage";
import {
  clearAuthSessionTokens,
  getAuthSessionTokens,
  onAuthFailure,
  setAuthSessionTokens,
  subscribeToAuthSession
} from "@common/api/sdk/authSession";

type PersistedAuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  tokens: SessionTokens;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setSessionTokens: (tokens: SessionTokens) => void;
  logout: (options?: { redirectToLogin?: boolean }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const toNullableString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const parseStoredState = (rawValue: string | null): PersistedAuthState => {
  if (!rawValue) {
    return { user: null, accessToken: null, refreshToken: null };
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PersistedAuthState>;

    const safeUser =
      parsed.user && typeof parsed.user === "object"
        ? (parsed.user as AuthUser)
        : null;

    return {
      user: safeUser,
      accessToken: toNullableString(parsed.accessToken),
      refreshToken: toNullableString(parsed.refreshToken)
    };
  } catch (_error) {
    return { user: null, accessToken: null, refreshToken: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [tokens, setTokens] = useState<SessionTokens>({
    accessToken: null,
    refreshToken: null
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const isClearingSessionRef = useRef(false);

  const setSessionTokens = useCallback((nextTokens: SessionTokens) => {
    setAuthSessionTokens({
      accessToken: toNullableString(nextTokens.accessToken),
      refreshToken: toNullableString(nextTokens.refreshToken)
    });
  }, []);

  const logout = useCallback(
    async (options?: { redirectToLogin?: boolean }) => {
      if (isClearingSessionRef.current) {
        return;
      }

      isClearingSessionRef.current = true;

      clearAuthSessionTokens();
      setUser(null);
      setTokens({ accessToken: null, refreshToken: null });

      try {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (_error) {
      } finally {
        isClearingSessionRef.current = false;
      }

      if (options?.redirectToLogin ?? true) {
        router.replace("/login");
      }
    },
    []
  );

  useEffect(() => {
    return subscribeToAuthSession((sessionTokens) => {
      setTokens(sessionTokens);
    });
  }, []);

  useEffect(() => {
    return onAuthFailure(() => {
      void logout({ redirectToLogin: true });
    });
  }, [logout]);

  useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        const stored = parseStoredState(storedValue);

        if (!isMounted) {
          return;
        }

        setUser(stored.user);
        setAuthSessionTokens({
          accessToken: stored.accessToken,
          refreshToken: stored.refreshToken
        });
      } finally {
        if (isMounted) {
          setIsHydrated(true);
        }
      }
    };

    void hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const persist = async () => {
      const session = getAuthSessionTokens();

      if (!user && !session.accessToken && !session.refreshToken) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      const payload: PersistedAuthState = {
        user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    };

    void persist();
  }, [isHydrated, user, tokens.accessToken, tokens.refreshToken]);

  const value = useMemo(
    () => ({
      user,
      tokens,
      isHydrated,
      setUser,
      setSessionTokens,
      logout
    }),
    [user, tokens, isHydrated, setSessionTokens, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
