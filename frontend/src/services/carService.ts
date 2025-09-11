import axios from 'axios';
import type { CarInfo } from '../interface/Car';

export interface RentPeriod {
  id?: number; // จาก backend ถ้ามี id
  rent_price: number;
  rent_start_date: string;
  rent_end_date: string;
}

export interface CarResponse {
  ID: number;
  carName: string;
  yearManufacture: number;
  sale_list: { sale_price: number }[];
  rent_list: RentPeriod[];
}

const API_URL = 'http://localhost:8080/cars';
const IMAGE_BASE_URL = 'http://localhost:8080/images/cars';



export const fetchCars = async (): Promise<CarInfo[]> => {
  const response = await axios.get(API_URL);
  return mapCars(response.data);
};

export const fetchCarById = async (id: string | number): Promise<CarResponse> => {
  const response = await axios.get(`${API_URL}/${id}`);
  const data = response.data;

  // map rent_list ของ backend
  const rent_list: RentPeriod[] = (data.rent_list || []).map((r: any) => ({
    id: r.ID, // ถ้า backend มี id ให้ใช้
    rent_price: r.rent_price,
    rent_start_date: r.rent_start_date,
    rent_end_date: r.rent_end_date,
  }));

  const car: CarResponse = {
    ID: data.ID,
    carName: data.car_name,
    yearManufacture: data.year_manufacture,
    sale_list: data.sale_list || [],
    rent_list,
  };

  return car;
};
// ----------------- Mapper Functions -----------------

const mapCars = (data: any[]): CarInfo[] => {
  return data.map(mapCar);
};

const mapCar = (car: any): CarInfo => ({
  ID: car.ID,
  carName: car.car_name,
  yearManufacture: car.year_manufacture,
  purchasePrice: car.purchase_price,
  startUseDate: car.purchase_date,
  color: car.color,

  brand: car.detail?.Brand
    ? { ID: car.detail.Brand.ID, brandName: car.detail.Brand.brand_name }
    : undefined,

  model: car.detail?.CarModel
    ? {
        ID: car.detail.CarModel.ID,
        modelName: car.detail.CarModel.ModelName,
        brandID: car.detail.CarModel.brandId,
      }
    : undefined,

  submodel: car.detail?.SubModel
    ? {
        ID: car.detail.SubModel.ID,
        submodelName: car.detail.SubModel.SubModelName,
        carModelID: car.detail.SubModel.CarModelID,
      }
    : undefined,

  province: car.province
    ? { ID: car.province.ID, provinceName: car.province.province_name }
    : undefined,

  pictures: car.pictures?.map((p: any) => ({
    ID: p.ID,
    path: `${IMAGE_BASE_URL}/${p.path}`, // ✅ ต่อ base url ให้ใช้ได้ทันที
    car_id: p.car_id,
  })),

  mileage: car.mileage,
  condition: car.condition,

  sale_list:
    car.sale_list?.map((s: any) => ({
      sale_price: s.sale_price,
    })) || [],

  rent_list:
    car.rent_list?.map((r: any) => ({
      rent_price: r.rent_price,
      rent_start_date: r.rent_start_date,
      rent_end_date: r.rent_end_date,
    })) || [],
});
