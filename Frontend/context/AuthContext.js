"use client";

import { createContext, useContext, useState, useEffect } from "react";

const STORAGE_KEY = "ai_interview_coach_user";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      // ignore
    }
    setReady(true);
  }, []);

  const login = (email, password) => {
    const u = { email, name: email.split("@")[0], id: String(Date.now()) };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {}
    return u;
  };

  const signup = (email, password, name) => {
    const u = {
      email,
      name: name || email.split("@")[0],
      id: String(Date.now()),
    };
    setUser(u);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } catch (e) {}
    return u;
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, ready }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
