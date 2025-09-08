import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import CarGrid from '../../../components/CarGrid';
import { Button } from 'antd';
import { Link } from 'react-router-dom';
import Sorter, { type SortOption } from '../../../components/Sorter';
import Filter, { type FilterValues } from '../../../components/Filter';
import type { SaleList } from '../../../interface/Car';

const conditionOrder = ['ดี', 'ปานกลาง', 'แย่'];

const SellListPage = () => {
  const [saleList, setSaleList] = useState<SaleList[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterValues | null>(null);
  const [sortOption, setSortOption] = useState<SortOption | undefined>(undefined);

  useEffect(() => {
    axios
      .get<SaleList[]>('http://localhost:8080/salelists')
      .then((res) => setSaleList(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 🟢 ฟังก์ชันคำนวณอายุจาก purchase_date
  const getCarAge = (purchase_date: string | null): number => {
    if (!purchase_date) return 0;
    const purchaseYear = new Date(purchase_date).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - purchaseYear;
  };

  // 🟢 Filter และ Sort ทำงานกับ SaleList โดยตรง
  const filteredSales = useMemo(() => {
    let result = saleList.filter((s) => s.car); // เผื่อบางอันไม่มี car

    if (filters) {
      result = result.filter((s) => {
        const c = s.car!;
        if (filters.brand && c.detail?.Brand?.brand_name !== filters.brand) return false;
        if (filters.model && c.detail?.CarModel?.ModelName !== filters.model) return false;

        // ✅ กรองราคาขาย
        if (filters.priceRange) {
          if (s.sale_price < filters.priceRange[0] || s.sale_price > filters.priceRange[1]) return false;
        }

        // ✅ กรองอายุจาก purchase_date
        if (filters.ageRange) {
          const age = getCarAge(c.purchase_date);
          if (age < filters.ageRange[0] || age > filters.ageRange[1]) return false;
        }

        // ✅ กรองเลขไมล์
        if (filters.mileageMax !== null && filters.mileageMax !== undefined) {
          if ((c.mileage ?? 0) > filters.mileageMax) return false;
        }

        // ✅ กรองสภาพ
        if (filters.conditions && filters.conditions.length > 0) {
          if (!filters.conditions.includes(c.condition ?? '')) return false;
        }

        return true;
      });
    }

    // ✅ Sort
    if (sortOption) {
      result = [...result].sort((a, b) => {
        const carA = a.car!;
        const carB = b.car!;
        switch (sortOption) {
          case 'priceAsc': return a.sale_price - b.sale_price;
          case 'priceDesc': return b.sale_price - a.sale_price;
          case 'mileageAsc': return (carA.mileage ?? 0) - (carB.mileage ?? 0);
          case 'mileageDesc': return (carB.mileage ?? 0) - (carA.mileage ?? 0);
          case 'condition':
            return (
              conditionOrder.indexOf(carA.condition ?? 'แย่') -
              conditionOrder.indexOf(carB.condition ?? 'แย่')
            );
          case 'yearUsedAsc': return getCarAge(carA.purchase_date) - getCarAge(carB.purchase_date);
          case 'yearUsedDesc': return getCarAge(carB.purchase_date) - getCarAge(carA.purchase_date);
          default: return 0;
        }
      });
    }

    return result;
  }, [saleList, filters, sortOption]);

  if (loading) return <p>กำลังโหลดข้อมูล...</p>;

  return (
    <div style={{ display: 'flex', width: '100%', marginTop: 5, padding: 10 }}>
      {/* Sidebar Filter */}
      <div style={{ zIndex: 2 }}>
        <Filter
          carList={saleList.map((s) => s.car!).filter(Boolean)} // ✅ ใช้ car จาก SaleList
          width={300}
          onApply={(v) => setFilters(v)}
          onClear={() => setFilters(null)}
        />
      </div>

      {/* Content */}
      <div style={{ marginLeft: 280, marginTop: 45, width: '100%' }}>
        {/* Header bar */}
        <div
          style={{
            height: 80,
            display: 'flex',
            alignItems: 'center',
            position: 'fixed',
            width: '100%',
            backgroundColor: '#FFD700',
            zIndex: 10,
            justifyContent: 'space-between',
            padding: 20,
          }}
        >
          <h2 style={{ color: 'black' }}>รถที่วางขาย</h2>
          <Sorter value={sortOption} onChange={setSortOption} />
          <div style={{ marginRight: 300 }}>
            <Link to="/add-sell">
              <Button type="primary">+ เพิ่มรายการขาย</Button>
            </Link>
          </div>
        </div>

        {/* Grid */}
        <div style={{ paddingTop: 80, paddingLeft: 30 }}>
          <CarGrid
            saleList={filteredSales} // ✅ ส่งเป็น SaleList
            cardType="customer"
            detailBasePath="/car-detail"
          />
        </div>
      </div>
    </div>
  );
};

export default SellListPage;
