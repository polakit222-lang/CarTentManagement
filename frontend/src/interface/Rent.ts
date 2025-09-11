// src/interface/Rent.ts

export interface RentPeriod {
  id?: number;                 // ID ของ DateforRent
  rent_price: number;          // ราคาต่อวัน
  rent_start_date: string;     // วันที่เริ่มเช่า (YYYY-MM-DD)
  rent_end_date: string; 
  temp?: boolean;      // วันที่สิ้นสุดเช่า (YYYY-MM-DD)
}

export interface SaleEntry {
  sale_price: number;
}

export interface CarPicture {
  id: number;
  title: string;
  path: string;  // URL หรือ path ของรูป
}

export interface CarResponse {
  id: number;                  // id ของรถ
  car_name: string;            // ชื่อรถ
  year_manufacture: number;    // ปีผลิต
  color: string;               // สี
  mileage: number;             // ระยะทาง
  condition: string;           // สภาพรถ
  sale_list?: SaleEntry[] | null;   // optional เพราะ backend ส่ง null บางครั้ง
  rent_list: RentPeriod[];          // array ของช่วงเช่า
  pictures?: CarPicture[];          // optional array ของรูปภาพ
}
