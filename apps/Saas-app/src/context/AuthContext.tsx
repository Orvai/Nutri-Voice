import { createContext, useContext, useState } from "react";

type User = {
  id: string;
  email: string;
  role: "coach" | "client";
  firstName: string;
  lastName: string;
  phone?: string | null;
  imageUrl?: string | null;
} | null;

type AuthContextType = {
  user: User;
  setUser: (u: User) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
