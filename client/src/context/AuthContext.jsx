import { translateNode, useLanguage as useTranslationLanguage } from "./LanguageContext.jsx";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  authApi,
  clearSession,
  getStoredUser,
  getToken,
  setSession,
  updateStoredUser,
} from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const translationLanguage = useTranslationLanguage().language;
  const [user, setUser] = useState(() => getStoredUser());
  const [loading, setLoading] = useState(() => Boolean(getToken()));

  useEffect(() => {
    let active = true;

    async function restore() {
      if (!getToken()) {
        setLoading(false);
        return;
      }
      try {
        const profile = await authApi.profile();
        if (!active) return;
        setUser(profile);
        updateStoredUser(profile);
      } catch {
        if (!active) return;
        clearSession();
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    function onUnauthorized() {
      setUser(null);
    }

    function onUserUpdated(event) {
      if (!event.detail) return;
      setUser(event.detail);
      updateStoredUser(event.detail);
    }

    restore();
    window.addEventListener("cso:unauthorized", onUnauthorized);
    window.addEventListener("cso:user-updated", onUserUpdated);
    return () => {
      active = false;
      window.removeEventListener("cso:unauthorized", onUnauthorized);
      window.removeEventListener("cso:user-updated", onUserUpdated);
    };
  }, []);

  const login = useCallback(async ({ email, password, remember }) => {
    const result = await authApi.login({ email, password });
    setSession(result.token, result.user, remember);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      canManage: user?.role === "admin" || user?.role === "staff",
    }),
    [user, loading, login, logout],
  );

  return translateNode(<AuthContext.Provider value={value}>{children}</AuthContext.Provider>, translationLanguage);
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider.");
  return context;
}
