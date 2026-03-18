import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  clearAuthSessionTokens,
  getAuthSessionTokens,
  onAuthFailure,
  setAuthSessionTokens,
  subscribeToAuthSession,
} from "@common/api/sdk/authSession";

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  status: string;
  role: "trainer" | "client" | "admin";
  gender: string | null;
  city: string | null;
  imageUrl: string | null;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setUser: (user: AuthUser | null) => void;
  setToken: (token: string | null) => void;
  setSessionTokens: (tokens: {
    accessToken: string | null;
    refreshToken: string | null;
  }) => void;
  logout: (options?: { redirectToLogin?: boolean }) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const AUTH_STORAGE_KEY = "nutri.saas.auth.session";

type PersistedAuthState = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const toNullableString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const parseStoredAuthState = (rawValue: string | null): PersistedAuthState => {
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
      refreshToken: toNullableString(parsed.refreshToken),
    };
  } catch (_error) {
    return { user: null, accessToken: null, refreshToken: null };
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [refreshToken, setRefreshTokenState] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const isClearingSessionRef = useRef(false);

  const setToken = useCallback((nextAccessToken: string | null) => {
    const { refreshToken: currentRefreshToken } = getAuthSessionTokens();
    setAuthSessionTokens({
      accessToken: toNullableString(nextAccessToken),
      refreshToken: currentRefreshToken,
    });
  }, []);

  const setSessionTokens = useCallback(
    (tokens: { accessToken: string | null; refreshToken: string | null }) => {
      setAuthSessionTokens({
        accessToken: toNullableString(tokens.accessToken),
        refreshToken: toNullableString(tokens.refreshToken),
      });
    },
    []
  );

  const logout = useCallback(
    async (options?: { redirectToLogin?: boolean }) => {
      if (isClearingSessionRef.current) {
        return;
      }

      isClearingSessionRef.current = true;

      clearAuthSessionTokens();
      setUser(null);
      setTokenState(null);
      setRefreshTokenState(null);

      try {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      } catch (_error) {
        // No-op: local session state is already cleared
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
    return subscribeToAuthSession((tokens) => {
      setTokenState(tokens.accessToken);
      setRefreshTokenState(tokens.refreshToken);
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
        const storedState = parseStoredAuthState(storedValue);

        if (!isMounted) {
          return;
        }

        setUser(storedState.user);
        setAuthSessionTokens({
          accessToken: storedState.accessToken,
          refreshToken: storedState.refreshToken,
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
      if (!user && !token && !refreshToken) {
        await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
        return;
      }

      const payload: PersistedAuthState = {
        user,
        accessToken: token,
        refreshToken,
      };

      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(payload));
    };

    void persist();
  }, [isHydrated, user, token, refreshToken]);

  const value = useMemo(
    () => ({
      user,
      token,
      refreshToken,
      isHydrated,
      setUser,
      setToken,
      setSessionTokens,
      logout,
    }),
    [user, token, refreshToken, isHydrated, setUser, setToken, setSessionTokens, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
