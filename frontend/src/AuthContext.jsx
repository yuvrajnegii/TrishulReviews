import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE } from "./constants";

const AuthContext = createContext(null);

const STORAGE_KEY = "guestlens_auth";

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (auth) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [auth]);

  async function signup({ name, email, password }) {
    const res = await fetch(`${API_BASE}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Signup failed");
    setAuth(data);
    return data;
  }

  async function login({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Login failed");
    setAuth(data);
    return data;
  }

  // Used by the OAuth callback page to set auth from URL params
  function loginWithToken(data) {
    setAuth(data);
  }

  function logout() {
    setAuth(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user || null,
        token: auth?.token || null,
        isAuthenticated: !!auth?.token,
        signup,
        login,
        loginWithToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside an <AuthProvider>");
  return ctx;
}
