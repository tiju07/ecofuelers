// FILE: AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  username: string;
  role: "admin" | "employee";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, role: "admin" | "employee", token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('access_token='))
      ?.split('=')[1];
    console.log("Token:", token);
    if (token) {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (token) setUser(decodedToken);
    }
  }, []);

  // Login function: store user and token in state and localStorage
  const login = (username: string, role: "admin" | "employee", token: string) => {
    const userData = { username, role };
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  };

  // Logout function: clear user and token from state and localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    // return !!token;
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};