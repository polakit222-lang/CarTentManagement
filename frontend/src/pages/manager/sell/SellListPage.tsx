import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import CarGrid from '../../../components/CarGrid';
import Filter from '../../../components/Filter/Filter';
import Sorter, { type SortOption } from '../../../components/Sorter';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import type { CarInfo, FilterValues} from '../../../interface/Car';

const conditionOrder = ['ดี', 'ปานกลาง', 'แย่'];

const SellListPage: React.FC = () => {
  const [carList, setCarList] = useState<CarInfo[]>([]);
  const [filters, setFilters] = useState<FilterValues>({});
  const [sortOption, setSortOption] = useState<SortOption | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API จริง
  useEffect(() => {
    axios.get<CarInfo[]>('http://localhost:8080/cars/filter?type=sale')
      .then(res => setCarList(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getCarAge = (purchase_date: string | null) => {
    if (!purchase_date) return 0;
    return new Date().getFullYear() - new Date(purchase_date).getFullYear();
  };

  // Filter & Sort
  const filteredCars = useMemo(() => {
    let result = carList;

    // Filter
    result = result.filter(c => {
      const car = c.car;
      if (filters.brand && car.detail?.Brand?.brand_name !== filters.brand) return false;
      if (filters.model && car.detail?.CarModel?.ModelName !== filters.model) return false;
      if (filters.subModel && car.detail?.SubModel?.SubModelName !== filters.subModel) return false;
      if (filters.priceRange) {
        const price = c.sale_price ?? 0;
        if (price < filters.priceRange[0] || price > filters.priceRange[1]) return false;
      }
      if (filters.mileageMax && car.mileage > filters.mileageMax) return false;
      if (filters.ageRange && car.purchase_date) {
        const age = getCarAge(car.purchase_date);
        if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
      }
      if (filters.conditions && !filters.conditions.includes(car.condition)) return false;
      return true;
    });

    // Sort
    if (sortOption) {
      result = [...result].sort((a, b) => {
        const carA = a.car;
        const carB = b.car;
        switch (sortOption) {
          case 'priceAsc': return (a.sale_price ?? 0) - (b.sale_price ?? 0);
          case 'priceDesc': return (b.sale_price ?? 0) - (a.sale_price ?? 0);
          case 'mileageAsc': return (carA.mileage ?? 0) - (carB.mileage ?? 0);
          case 'mileageDesc': return (carB.mileage ?? 0) - (carA.mileage ?? 0);
          case 'condition': return conditionOrder.indexOf(carA.condition) - conditionOrder.indexOf(carB.condition);
          case 'yearUsedAsc': return getCarAge(carA.purchase_date) - getCarAge(carB.purchase_date);
          case 'yearUsedDesc': return getCarAge(carB.purchase_date) - getCarAge(carA.purchase_date);
          default: return 0;
        }
      });
    }

    return result;
  }, [carList, filters, sortOption]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 5, padding: 10 }}>
      <Filter
        cars={carList}
        onApply={setFilters}
        onClear={() => setFilters({})}
      />
      <div style={{ marginLeft: 280, marginTop: 45, width: '100%' }}>
        <div style={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          position: 'fixed',
          width: '100%',
          backgroundColor: '#FFD700',
          zIndex: 10,
          justifyContent: 'space-between',
          padding: 20,
        }}>
          <h2>รถที่วางขาย</h2>
          <Sorter value={sortOption} onChange={setSortOption} />
          <Link to="/add-sell">
            <Button type="primary">+ เพิ่มรายการขาย</Button>
          </Link>
        </div>
        <div style={{ paddingTop: 80, paddingLeft: 30 }}>
          <CarGrid
            cars={filteredCars} // ส่งเฉพาะ BaseCar
            type="sale"
          />
        </div>
      </div>
    </div>
  );
};

export default SellListPage;
