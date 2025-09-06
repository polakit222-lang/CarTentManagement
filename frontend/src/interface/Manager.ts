// src/interface/Manager.ts

export interface Manager {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;

  Username: string;
  Email: string;
  Password?: string; // ตั้งเป็น optional ด้วยเหตุผลเดียวกับ Employee
  FirstName: string;
  LastName: string;
  Birthday: string; // Time.Time จะถูกแปลงเป็น string
}