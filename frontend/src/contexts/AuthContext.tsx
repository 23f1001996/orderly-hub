import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  apiLogin,
  apiRegister,
  apiLogout,
  apiGetCurrentUser,
  setToken,
  clearToken,
  getToken,
  toFrontendRole,
  FrontendRole,
} from "@/services/api";

export type UserRole = FrontendRole;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  authError: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // true while hydrating from token

  // On mount, attempt to restore session from stored token
  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    apiGetCurrentUser()
      .then((u) =>
        setUser({
          id: "me",
          name: u.name,
          email: u.email,
          role: toFrontendRole(u.role),
        })
      )
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (
    email: string,
    password: string,
    _role: UserRole // role selected in UI; real role comes from the server
  ) => {
    setAuthError(null);
    const data = await apiLogin(email, password);
    setToken(data["auth-token"]);
    setUser({
      id: String(data.id),
      name: data.name ?? email.split("@")[0],
      email: data.email,
      role: toFrontendRole(data.role),
    });
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    setAuthError(null);
    await apiRegister(name, email, password, role);
    // After registration, log in immediately to get the auth token
    const data = await apiLogin(email, password);
    setToken(data["auth-token"]);
    setUser({
      id: String(data.id),
      name: data.name ?? name,
      email: data.email,
      role: toFrontendRole(data.role),
    });
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch {
      // Ignore logout errors (token might already be expired)
    } finally {
      clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        authError,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
