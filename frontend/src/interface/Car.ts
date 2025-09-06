import dayjs, { Dayjs } from 'dayjs';

dayjs.locale('th');

export interface CarInfo {
  purchaseDate: any;
  color: string;
  registrationNumber: string;
  registrationProvince: string;
  id: number;
  brand: string;
  model: string;
  subModel: string;
  mileage: number;
  price: number;
  yearManufactured: number;
  yearUsed: number;
  condition: string;
  pic: string[];
  status: string[];
}

export interface Car {
  id: number;
  registrationNumber: string;
  registrationProvince: string;
  purchaseDate: Dayjs | null;
  brand?: Brand["brand"];
  model?: Model["model"];
  subModel?: SubModel["submodel"];
  mileage: number;
  color: string;
  price: number;
  yearManufactured: number;
  yearUsed: number;
  condition: string;
  pic: string[];
  status: string[] | null;
}

export interface Brand {
  id: number;
  brand: string;
}

export interface Model {
  id: number;
  model: string;
  brand?: string;
}

export interface SubModel {
  id: number;
  submodel: string;
  model?: string;
}

export interface ProvinceInfo {
  id: number;
  province: string;
}