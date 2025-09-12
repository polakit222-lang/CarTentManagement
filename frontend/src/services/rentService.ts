// src/services/rentService.ts
import axios from 'axios';
import type { CarResponse } from '../interface/Rent';

const API_URL = 'http://localhost:8080/rentlists';

const rentService = {
  // ดึงข้อมูลรถพร้อม rent list
  async getRentListsByCar(carId: number): Promise<CarResponse> {
    const { data } = await axios.get<CarResponse>(`${API_URL}/${carId}`);
    return data;
  },

  // สร้างหรืออัปเดต rent list
  async createOrUpdateRentList(payload: {
    car_id: number;
    status: string;
    manager_id: number;
    dates: {
      id?: number; // ✅ เพิ่ม id ไว้เผื่อ update
      open_date: string;
      close_date: string;
      rent_price: number;
    }[];
  }): Promise<CarResponse> {
    const { data } = await axios.put<CarResponse>(`${API_URL}`, payload);
    return data;
  },

  // ✅ ลบ rent date ตาม id
  async deleteRentDate(dateId: number): Promise<{ message: string }> {
    const { data } = await axios.delete<{ message: string }>(`${API_URL}/date/${dateId}`);
    return data;
  },
};

export default rentService;
