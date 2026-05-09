"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../lib/api";
import { User, Permissions } from "../lib/types";

type AuthCtx = {
  user: User | null;
  loading: boolean;
  perms: Permissions | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  can: (action: string) => boolean;
};

const AuthContext = createContext<AuthCtx>({
  user: null,
  loading: true,
  perms: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {},
  can: () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [perms, setPerms] = useState<Permissions | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await api.get<{ user: User }>("/api/me");
      setUser(res.user);
      try {
        const p = await api.get<{ data: Permissions }>("/api/permissions");
        setPerms(p.data);
      } catch {}
    } catch {
      setUser(null);
      setPerms(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (username: string, password: string) => {
    const res = await api.post<{ user: User }>("/api/login", { username, password });
    setUser(res.user);
    try {
      const p = await api.get<{ data: Permissions }>("/api/permissions");
      setPerms(p.data);
    } catch {}
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch {}
    setUser(null);
    setPerms(null);
  };

  const can = (action: string) => {
    if (!user || !perms) return false;
    return !!perms[user.role]?.[action];
  };

  return (
    <AuthContext.Provider value={{ user, loading, perms, login, logout, refresh, can }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
