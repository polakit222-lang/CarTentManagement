export interface CarPicture {
  ID: number;
  title: string;
  path: string;
  car_id: number;
}

export type CarType = 'sale' | 'rent' | 'noUse';

export interface BaseCar {
  ID: number;
  car_name: string;
  purchase_date: string | null;
  purchase_price: number;
  year_manufacture: number;
  mileage: number;
  condition: string;
  color: string;
  pictures: CarPicture[];
  detail?: {
    Brand?: { brand_name: string };
    CarModel?: { ModelName: string };
    SubModel?: { SubModelName: string };
  };
}

export interface SaleList {
  car?: BaseCar | null; // เผื่อ JSON บางตัวไม่มี car
  sale_price: number;
}

export interface RentList {
  car?: BaseCar | null;
  rent_price: number;
  rent_start_date?: string;
  rent_end_date?: string;
}

export interface NoUseList {
  car?: BaseCar | null;
}

export interface CarInfo {
  type: CarType;
  car: BaseCar;
  sale_list?: SaleList; // optional เผื่อไม่ใช่ sale
  rent_list?: RentList; // optional เผื่อไม่ใช่ rent
  sale_price?: number;  // shortcut สำหรับ sale
  rent_price?: number;  // shortcut สำหรับ rent
  rent_start_date?: string;
  rent_end_date?: string;
}

export interface FilterValues {
  type?: CarType;
  priceRange?: [number, number];
  ageRange?: [number, number];
  mileageMax?: number;
  conditions?: string[];
  brand?: string;
  model?: string;
  subModel?: string;
}

// Sort option สำหรับ Sorter
export type SortOption =
  | 'priceAsc'
  | 'priceDesc'
  | 'mileageAsc'
  | 'mileageDesc'
  | 'condition'
  | 'yearUsedAsc'
  | 'yearUsedDesc';
