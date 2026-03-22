"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, setLoggingOut } from "@/lib/api/client";
import type { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
  canAccessAdmin: () => boolean;
  canAccessManager: () => boolean;
}

interface SignupData {
  email: string;
  password: string;
  name: string;
  orgId?: string;
  inviteToken?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("cortex_at") : null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch profile ONCE on mount only — not on every pathname change.
  // Individual protected layouts handle route-level auth guards.
  useEffect(() => {
    if (!mounted) return;
    fetchProfile();
  }, [mounted]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      if (response.success) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      setUser(null);
      // 401 on any path → session expired; redirect handled by the
      // 401 interceptor in client.ts (it checks whether we're on a private route).
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    if (response.success) {
      setUser(response.data.user);
      if (response.data.accessToken) {
        localStorage.setItem("cortex_at", response.data.accessToken);
        setAccessToken(response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem("cortex_rt", response.data.refreshToken);
      }
      router.push("/dashboard");
    } else {
      throw new Error(response.message || "Login failed");
    }
  };

  const signup = async (data: SignupData) => {
    const response = await api.signup(data);
    if (response.success) {
      setUser(response.data.user);
      if (response.data.accessToken) {
        localStorage.setItem("cortex_at", response.data.accessToken);
        setAccessToken(response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem("cortex_rt", response.data.refreshToken);
      }
      router.push("/dashboard");
    } else {
      throw new Error(response.message || "Signup failed");
    }
  };

  const logout = async () => {
    setLoggingOut(true);
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("cortex_at");
    localStorage.removeItem("cortex_rt");
    api.logout().catch(() => {});
    window.location.href = "/login?logout=success";
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  const refreshUser = async () => {
    await fetchProfile();
  };

  const hasRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false;
  };

  const canAccessAdmin = () => {
    return user?.role === "ADMIN";
  };

  const canAccessManager = () => {
    return user?.role === "ADMIN" || user?.role === "MANAGER";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateUser,
        refreshUser,
        hasRole,
        canAccessAdmin,
        canAccessManager,
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
