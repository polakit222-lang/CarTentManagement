
import type { Manager } from "./Manager";
import type { Employee } from "./Employee";
import type { SaleContract } from "./Salecontract";


export interface CarInfo {
  ID: number;
  car_name: string;
  purchase_date: string | null;
  purchase_price: number;
  year_manufacture: number;
  mileage: number;
  condition: string;
  status?: string;   // เผื่อ backend ยังไม่มีส่งมา
  color: string;
  pictures: CarPicture[];
  detail?: {
    Brand?: { brand_name: string };
    CarModel?: { ModelName: string };
    SubModel?: { SubModelName: string };
  };
}

export interface CarPicture {
  ID: number;
  title: string;
  path: string;
  car_id: number;
}
export interface CarForSale {
  car: CarInfo;
  sale_price: number;
}
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
