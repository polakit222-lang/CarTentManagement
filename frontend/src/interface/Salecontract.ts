import type { SaleList } from "./CarSell";
import type { Employee } from "./Employee";

export interface SaleContract {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;

  SaleListID: number;
  SaleList?: SaleList | null;

  EmployeeID: number;
  Employee?: Employee | null;

  CustomerID: number;
  Customer?: unknown | null;

  InspectionAppointments?: unknown | null;
  Payment?: unknown | null;
}
