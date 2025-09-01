// src/data/users.ts

// Make sure to export this interface
export interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'customer';
}

// Make sure to export this interface
export interface Manager {
  id: number;
  name: string;
  ManagerId: string;
  password: string;
  role: 'manager';
}

// Make sure to export this interface
export interface Employee {
  id: number;
  name: string;
  employeeId: string;
  password: string;
  role: 'employee';
}

export const mockCustomers: Customer[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'customer' },
  { id: 2, name: 'Bob', email: 'bob@example.com', password: 'password456', role: 'customer' },
];

export const mockManagers: Manager[] = [
  { id: 101, name: 'Manager Mike', ManagerId: 'MGR01', password: '1234567', role: 'manager' },
];

export const mockEmployees: Employee[] = [
  { id: 201, name: 'สมชาย', employeeId: 'EMP01', password: 'emppassword', role: 'employee' },
  { id: 202, name: 'สมศรี', employeeId: 'EMP02', password: 'emppassword', role: 'employee' },
  { id: 203, name: 'John Doe', employeeId: 'EMP03', password: 'emppassword', role: 'employee' },
];