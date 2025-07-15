// FILE: AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCookie } from './Services';
import axios from 'axios';

interface User {
  username: string;
  first_name: string | null;
  last_name: string | null;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: () => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    var token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
    console.log('Token:', token);
    if (token) {
      console.log(token);
      token = token.substring(7);
      console.log('Token after substring:', token);
      setToken(token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      console.log('Decoded token:', decodedToken);
      if (token) {
        setUser({
          username: decodedToken.username,
          first_name: decodedToken.first_name || null,
          last_name: decodedToken.last_name || null,
          role: decodedToken.role || 'user',
        });
        console.log('User set:', user);
      }
    }
  }, []);

  const login = () => {
    var token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1];
    if (token) {
      console.log(token);
      token = token.substring(8);
      setToken(token);
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      if (token) {
        setUser({
          username: decodedToken.username,
          first_name: decodedToken.first_name || null,
          last_name: decodedToken.last_name || null,
          role: decodedToken.role || 'user',
        });
      }
    }
  };

  // Logout function: clear user and token from state and localStorage
  const logout = () => {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUser(null);
    setToken(null);
  };

  // Check if the user is authenticated
  const isAuthenticated = () => {
    console.log('From authcontext' + token);
    return !!token;
    // return true;
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
