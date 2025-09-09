// src/services/employeeService.ts
import type { Employee } from "../types/employee";

const API = "http://localhost:8080/api/employees";

export async function fetchEmployee(id: number): Promise<Employee> {
  const res = await fetch(`${API}/${id}`);
  if (!res.ok) {
    throw new Error(`fetchEmployee failed: ${res.status}`);
  }
  return res.json();
}

export async function updateEmployee(employee: Employee): Promise<Employee> {
  const res = await fetch(`${API}/${employee.employeeID}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employee),
  });
  if (!res.ok) {
    throw new Error(`updateEmployee failed: ${res.status}`);
  }
  return res.json();
}
