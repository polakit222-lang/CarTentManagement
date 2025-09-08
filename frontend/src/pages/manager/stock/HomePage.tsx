// HomePage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import CarGrid from '../../../components/CarGrid';
import '../../../style/sidebar.css';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Filter, { type FilterValues } from '../../../components/Filter';
import Sorter, { type SortOption } from '../../../components/Sorter';
import type { CarInfo } from '../../../interface/Car';
import axios from 'axios';

const conditionOrder = ['ดี', 'ปานกลาง', 'แย่'];

const HomePage: React.FC = () => {
  const [cars, setCars] = useState<CarInfo[]>([]);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [sortOption, setSortOption] = useState<SortOption | undefined>(undefined);

  useEffect(() => {
    axios.get<CarInfo[]>('http://localhost:8080/cars')
      .then((res) => {
        setCars(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // 🔹 ฟังก์ชันคำนวณอายุการใช้งานจาก purchase_date
  const getCarAge = (purchase_date: string | null): number => {
    if (!purchase_date) return 0;
    const purchaseYear = new Date(purchase_date).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - purchaseYear;
  };

  // กรองและ sort
  const filteredCars = useMemo(() => {
    let result = cars;

    if (filters) {
      result = result.filter(c => {
        // ✅ กรองราคาซื้อ
        if (filters.priceRange) {
          const p = c.purchase_price ?? 0;
          if (p < filters.priceRange[0] || p > filters.priceRange[1]) return false;
        }

        // ✅ กรองอายุการใช้งาน
        if (filters.ageRange) {
          const age = getCarAge(c.purchase_date);
          if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
        }

        // ✅ กรองเลขไมล์
        if (filters.mileageMax != null) {
          if ((c.mileage ?? 0) > filters.mileageMax) return false;
        }

        // ✅ กรองสภาพรถ
        if (filters.conditions?.length) {
          if (!filters.conditions.includes(c.condition ?? '')) return false;
        }

        // ✅ กรองสถานะ
        if (filters.status?.length) {
          if (!filters.status.includes(c.status ?? '')) return false;
        }

        // ✅ กรองยี่ห้อ รุ่น ซับรุ่น
        if (filters.brand) {
          if (c.detail?.Brand?.brand_name !== filters.brand) return false;
        }
        if (filters.model) {
          if (c.detail?.CarModel?.ModelName !== filters.model) return false;
        }
        if (filters.subModel) {
          if (c.detail?.SubModel?.SubModelName !== filters.subModel) return false;
        }

        return true;
      });
    }

    // ✅ Sort
    if (sortOption) {
      result = [...result].sort((a, b) => {
        switch (sortOption) {
          case 'priceAsc': return (a.purchase_price ?? 0) - (b.purchase_price ?? 0);
          case 'priceDesc': return (b.purchase_price ?? 0) - (a.purchase_price ?? 0);
          case 'mileageAsc': return (a.mileage ?? 0) - (b.mileage ?? 0);
          case 'mileageDesc': return (b.mileage ?? 0) - (a.mileage ?? 0);
          case 'condition':
            return (conditionOrder.indexOf(a.condition ?? 'แย่')) - (conditionOrder.indexOf(b.condition ?? 'แย่'));
          case 'yearUsedAsc':
            return getCarAge(a.purchase_date) - getCarAge(b.purchase_date);
          case 'yearUsedDesc':
            return getCarAge(b.purchase_date) - getCarAge(a.purchase_date);
          default: return 0;
        }
      });
    }

    return result;
  }, [cars, filters, sortOption]);

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 5, padding: 10 }}>
      <div style={{ zIndex: 2 }}>
        <Filter
          carList={cars}
          width={300}
          onApply={setFilters}
          onClear={() => setFilters(null)}
        />
      </div>

      <div style={{ marginLeft: 280, marginTop: 45, width: '100%' }}>
        <main className="mainWithSidebar">
          <div style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            width: '100%',
            backgroundColor: '#FFD700',
            zIndex: 10,
            justifyContent: 'space-between',
            padding: 20
          }}>
            <h2 style={{ color: 'black' }}>รถทั้งหมดในเตนท์</h2>
            <Sorter value={sortOption} onChange={setSortOption} />
            <div style={{ marginRight: 300 }}>
              <Link to="/add-car">
                <Button type="primary">+ ลงทะเบียนรถใหม่</Button>
              </Link>
            </div>
          </div>
        </main>

        <div style={{ paddingTop: 80, paddingLeft: 30 }}>
          <CarGrid
            cars={filteredCars}
            cardType="admin"
            editBasePath="/edit"
            deleteBasePath="/delete"
            rentBasePath="/rent"
            sellBasePath="/sell"
            addBasePath="/add"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
