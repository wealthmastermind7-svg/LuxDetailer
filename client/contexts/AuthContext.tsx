import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { getApiUrl } from "@/lib/query-client";

interface User {
  id: string;
  username: string;
  email: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, email?: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "luxdetailer_auth_token";
const USER_KEY = "luxdetailer_user";

async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

async function setStoredToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

async function removeStoredToken(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}

async function getStoredUser(): Promise<User | null> {
  try {
    let userData: string | null;
    if (Platform.OS === "web") {
      userData = localStorage.getItem(USER_KEY);
    } else {
      userData = await SecureStore.getItemAsync(USER_KEY);
    }
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
}

async function setStoredUser(user: User): Promise<void> {
  const userData = JSON.stringify(user);
  if (Platform.OS === "web") {
    localStorage.setItem(USER_KEY, userData);
  } else {
    await SecureStore.setItemAsync(USER_KEY, userData);
  }
}

async function removeStoredUser(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(USER_KEY);
  } else {
    await SecureStore.deleteItemAsync(USER_KEY);
  }
}

let globalToken: string | null = null;

export function getAuthToken(): string | null {
  return globalToken;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const storedToken = await getStoredToken();
        const storedUser = await getStoredUser();
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
          globalToken = storedToken;
        }
      } catch (error) {
        console.error("Failed to load stored auth:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStoredAuth();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const baseUrl = getApiUrl();
    const url = new URL("/api/auth/login", baseUrl);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Login failed");
    }

    const data = await res.json();
    await setStoredToken(data.token);
    await setStoredUser(data.user);
    setToken(data.token);
    setUser(data.user);
    globalToken = data.token;
  }, []);

  const register = useCallback(async (username: string, password: string, email?: string, phone?: string) => {
    const baseUrl = getApiUrl();
    const url = new URL("/api/auth/register", baseUrl);
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, email, phone }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Registration failed");
    }

    const data = await res.json();
    await setStoredToken(data.token);
    await setStoredUser(data.user);
    setToken(data.token);
    setUser(data.user);
    globalToken = data.token;
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        const baseUrl = getApiUrl();
        const url = new URL("/api/auth/logout", baseUrl);
        await fetch(url, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      await removeStoredToken();
      await removeStoredUser();
      setToken(null);
      setUser(null);
      globalToken = null;
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
