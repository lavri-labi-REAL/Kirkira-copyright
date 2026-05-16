"use client";

import { createContext, useContext, ReactNode } from "react";

// Auth is handled by the parent Kira platform.
// This context is kept as a no-op so existing component imports don't break.
interface AuthContextValue {
  user: null;
  token: null;
}

const AuthContext = createContext<AuthContextValue>({ user: null, token: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: null, token: null }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
