import React, { useEffect, useState, useMemo } from 'react';
import CarGrid from '../../../components/CarGrid';
import Filter from '../../../components/Filter/Filter';
import type { BaseCar, CarInfo, FilterValues } from '../../../interface/Car';
import axios from 'axios';

const HomePage: React.FC = () => {
  const [cars, setCars] = useState<BaseCar[]>([]);
  const [filters, setFilters] = useState<FilterValues>({});

  // ดึงข้อมูลจาก API /cars
  useEffect(() => {
    axios.get<BaseCar[]>('http://localhost:8080/cars')
      .then(res => setCars(res.data))
      .catch(err => console.error(err));
  }, []);

  // แปลง BaseCar[] → CarInfo[] สำหรับ Filter
  const carInfoList: CarInfo[] = useMemo(() => {
    return cars.map(car => ({
      type: 'sale', // เราใช้ sale เป็น default
      car,
      sale_price: car.purchase_price,
    }));
  }, [cars]);

  // Filter ตาม FilterValues
  const filteredCars = useMemo(() => {
    return carInfoList.filter(c => {
      const car = c.car;

      // filter type
      if (filters.type && c.type !== filters.type) return false;

      // filter price
      if (filters.priceRange) {
        const price = c.sale_price ?? car.purchase_price;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      }

      // filter brand/model/subModel
      if (filters.brand && car.detail?.Brand?.brand_name !== filters.brand) return false;
      if (filters.model && car.detail?.CarModel?.ModelName !== filters.model) return false;
      if (filters.subModel && car.detail?.SubModel?.SubModelName !== filters.subModel) return false;

      // filter mileage
      if (filters.mileageMax && car.mileage > filters.mileageMax) return false;

      // filter age
      if (filters.ageRange && car.purchase_date) {
        const age = new Date().getFullYear() - new Date(car.purchase_date).getFullYear();
        if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
      }

      // filter condition
      if (filters.conditions && !filters.conditions.includes(car.condition)) return false;

      return true;
    });
  }, [carInfoList, filters]);

  return (
    <div style={{ display: 'flex', padding: 20 }}>
      <Filter
        cars={carInfoList} // ส่ง CarInfo[] ให้ Filter ใช้
        onApply={setFilters}
        onClear={() => setFilters({})}
      />
      <div style={{ marginLeft: 20, flex: 1 }}>
        <CarGrid
          cars={filteredCars} // <-- เปลี่ยนจาก Cars เป็น cars
          type="sale"
        />
      </div>
    </div>
  );
};

export default HomePage;
