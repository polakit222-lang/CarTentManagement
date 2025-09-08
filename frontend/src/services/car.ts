import axios from "axios";

export interface Car {
  ID: number;
  CarName: string;
  Brand?: string;
  Model?: string;
  Price?: number;
  YearManufactured?: number;
  Mileage?: number;
  Status?: string | string[];
  Condition?: string;
  YearUsed?: number;
}

const api = axios.create({
  baseURL: "http://localhost:8080", // backend URL
  headers: { "Content-Type": "application/json" },
});

export const getCars = async (): Promise<Car[]> => {
  const res = await api.get("/cars");
  return res.data;
};
