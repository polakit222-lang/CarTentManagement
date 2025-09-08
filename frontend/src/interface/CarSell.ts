// SaleList.ts
import type { CarInfo } from "./Car";
import type { Manager } from "./Manager";
import type { Employee } from "./Employee";
import type { SaleContract } from "./Salecontract";

export interface SaleList {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;

  sale_price: number;       // 👈 JSON ที่ backend ส่งมาสะกดแบบนี้จริง ๆ
  carID: number;
  car?: CarInfo | null;

  status: string;

  managerID: number;
  manager?: Manager | null;

  employeeID: number;
  employee?: Employee | null;

  SalesContract: SaleContract[]; // 👈 ชื่อ field ใน JSON ขึ้นต้นด้วยตัวใหญ่
}
