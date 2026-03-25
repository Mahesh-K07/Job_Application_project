import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "jobportal_user";

// Demo accounts
const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  "admin@jobportal.com": {
    password: "admin123",
    user: { id: "admin-1", name: "Admin User", email: "admin@jobportal.com", role: "admin" },
  },
  "user@jobportal.com": {
    password: "user123",
    user: { id: "user-1", name: "John Doe", email: "user@jobportal.com", role: "user" },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const account = DEMO_ACCOUNTS[email];
    if (account && account.password === password) {
      setUser(account.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(account.user));
      return;
    }
    // Check registered users
    const registeredUsers = JSON.parse(localStorage.getItem("jobportal_registered") || "[]");
    const found = registeredUsers.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const userData: User = { id: found.id, name: found.name, email: found.email, role: "user" };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return;
    }
    throw new Error("Invalid email or password");
  }, []);

  const register = useCallback(async (userData: { name: string; email: string; password: string }) => {
    await new Promise((r) => setTimeout(r, 500));
    if (DEMO_ACCOUNTS[userData.email]) {
      throw new Error("Email already exists");
    }
    const registeredUsers = JSON.parse(localStorage.getItem("jobportal_registered") || "[]");
    if (registeredUsers.some((u: any) => u.email === userData.email)) {
      throw new Error("Email already exists");
    }
    const newUser = { ...userData, id: String(Date.now()) };
    registeredUsers.push(newUser);
    localStorage.setItem("jobportal_registered", JSON.stringify(registeredUsers));
    const user: User = { id: newUser.id, name: newUser.name, email: newUser.email, role: "user" };
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
