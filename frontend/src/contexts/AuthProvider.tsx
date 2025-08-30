// src/contexts/AuthProvider.tsx
import React, { useState } from 'react';
import type { ReactNode } from 'react'; // <-- แก้ไขตรงนี้
import { AuthContext } from './AuthContext';
import type { User } from './AuthContext'; // <-- แก้ไขตรงนี้

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const authContextValue = {
    isAuthenticated: !!user,
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;