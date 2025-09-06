// src/contexts/AuthContext.ts

import { createContext } from 'react';
import type { Customer } from '../interface/Customer';
import type { Employee } from '../interface/Employee';
import type { Manager } from '../interface/Manager'; // Import the Manager interface
// A Union Type that can be a Customer, an Employee, or a Manager
export type User = Customer | Employee | Manager;

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  role: 'customer' | 'employee' | 'manager' | undefined | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

// Create and export ONLY the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);