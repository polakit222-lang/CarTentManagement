// interface/Rent.ts

// ช่วงเวลาที่ให้เช่า
export interface RentPeriod {
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  price: number;
}

// ข้อมูลสำหรับสร้าง RentList
export interface RentListRequest {
  car_id: number;
  status: string;
  rent_price: number;
  manager_id: number;
  periods: RentPeriod[];
}

// ข้อมูล RentList ที่ดึงมาจาก API (optional)
export interface RentListInfo {
  ID: number;
  car_id: number;
  status: string;
  rent_price: number;
  manager_id: number;
  periods: RentPeriod[];
}
