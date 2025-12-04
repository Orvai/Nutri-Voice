import { createContext, useContext, useState } from "react";
import { UserProfile } from "../types/auth";

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  setUser: (u: UserProfile | null) => void;
  setToken: (t: string | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  function logout() {
    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
