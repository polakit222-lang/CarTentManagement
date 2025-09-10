// src/services/rentService.ts
import axios from 'axios';

export const API_URL = 'http://localhost:8080/api/rentlists';

// Type สำหรับ RentPeriod
export interface RentPeriod {
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  price: number;
}

// Type สำหรับส่งไปสร้าง RentList
export interface RentListRequest {
  car_id: number;
  status: string;
  rent_price: number;
  manager_id: number;
  periods: RentPeriod[];
}

// สร้าง RentList
export const createRentList = async (payload: RentListRequest) => {
  const response = await axios.post(API_URL, payload);
  return response.data;
};

// ดึง RentLists ทั้งหมด (optional)
export const fetchRentLists = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// ดึง RentList ตาม ID (optional)
export const fetchRentListByID = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};
