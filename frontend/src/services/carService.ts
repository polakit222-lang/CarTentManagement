// services/carService.ts
import axios from 'axios';
import type { CarInfo } from '../interface/Car';

const API_URL = 'http://localhost:8080/cars';
const IMAGE_BASE_URL = 'http://localhost:8080/images/cars';

export const fetchCars = async (): Promise<CarInfo[]> => {
  const response = await axios.get(API_URL);
  const data = response.data;

  const cars: CarInfo[] = data.map((car: any) => ({
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
      ? { ID: car.detail.CarModel.ID, modelName: car.detail.CarModel.ModelName, brandID: car.detail.CarModel.brandId }
      : undefined,
    submodel: car.detail?.SubModel
      ? { ID: car.detail.SubModel.ID, submodelName: car.detail.SubModel.SubModelName, carModelID: car.detail.SubModel.CarModelID }
      : undefined,
    province: car.province
      ? { ID: car.province.ID, provinceName: car.province.province_name }
      : undefined,
    pictures: car.pictures?.map((p: any) => ({
      ID: p.ID,
      path: p.path,  // frontend จะต่อ base url เอง
      car_id: p.car_id
    })),

    mileage: car.mileage,
    condition: car.condition,

    // แก้ให้ตรง type frontend
    sale_list: car.sale_list?.map((s: any) => ({
      sale_price: s.sale_price
    })) || [],

    rent_list: car.rent_list?.map((r: any) => ({
      rent_price: r.rent_price,
      rent_start_date: r.rent_start_date,
      rent_end_date: r.rent_end_date
    })) || []
  }));

  return cars;
};
