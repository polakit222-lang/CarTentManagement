// src/contexts/AuthContext.ts
import { createContext } from 'react';

// Define the structure of the user object
export interface User {
  id: number;
  name: string;
  role: 'customer' | 'manager' | 'employee';
}

// Define the shape of the context data
export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // User can be an object or null
  login: (userData: User) => void;
  logout: () => void;
}

// Create the context with an initial undefined value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);