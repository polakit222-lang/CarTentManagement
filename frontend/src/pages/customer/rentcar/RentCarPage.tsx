import React, { useState, useEffect } from "react";
import type { CarInfo, CarType, FilterValues, SortOption } from "../../../interface/Car";
import { fetchCars } from "../../../services/carService";
import CarCard from "../../../components/CarCard";
import Filter from "../../../components/Filter";

const RentCarPage: React.FC = () => {
  const [cars, setCars] = useState<CarInfo[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarInfo[]>([]);

  useEffect(() => {
    const loadCars = async () => {
      const data = await fetchCars();
      setCars(data);
      setFilteredCars(data);
    };
    loadCars();
  }, []);

  const handleApply = (filters: FilterValues, sort?: SortOption) => {
    let result = [...cars];

    if (filters.brand) result = result.filter(c => c.brand?.brandName === filters.brand);
    if (filters.model) result = result.filter(c => c.model?.modelName === filters.model);
    if (filters.subModel) result = result.filter(c => c.submodel?.submodelName === filters.subModel);
    if (filters.conditions?.length) result = result.filter(c => filters.conditions!.includes(c.condition!));
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      result = result.filter(c => c.purchasePrice >= min && c.purchasePrice <= max);
    }

    if (sort) {
      if (sort === "priceAsc") result.sort((a, b) => a.purchasePrice - b.purchasePrice);
      if (sort === "priceDesc") result.sort((a, b) => b.purchasePrice - a.purchasePrice);
      if (sort === "yearUsedAsc") result.sort((a, b) => a.yearManufacture - b.yearManufacture);
      if (sort === "yearUsedDesc") result.sort((a, b) => b.yearManufacture - a.yearManufacture);
    }

    setFilteredCars(result);
  };

  const handleClear = () => setFilteredCars(cars);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000", padding: "10px" }}>
    {/* หัวข้อ */}
    <Title
      level={2}
      style={{
      color: "#fff",
      margin: "0 0 20px 0",
      display: "inline-block",
      borderBottom: "3px solid gold", // เส้นขีดใต้ตัวหนังสือ
      paddingBottom: "6px",
      }}
    >
      เลือกรถยนต์ที่คุณต้องการเช่า
    </Title>
    {/* Container หลักแบบ Flex */}
    <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
      
{/* ฝั่งซ้าย: ฟิลเตอร์ */}
      <div style={{ width: "300px", flexShrink: 0, paddingTop: "2px" }}>
        <Filter
          carList={carList}
          width={300}
          enabledFilters={['brand', 'model', 'price', 'year']} // เลือกได้ว่าจะให้มี filter อะไรบ้าง
          onApply={(v) => setFilters(v)}
          onClear={() => setFilters(null)}
        />
      </div>

      {/* ฝั่งขวา: Car Grid */}
      <div
        style={{
          flex: 1,
          paddingTop: "20px",
        }}
      >
        <CarGrid cars={filteredCars} detailBasePath="/rentcar-details" />
      </div>
      </div>
    </div>
  );
};

export default RentCarPage;
