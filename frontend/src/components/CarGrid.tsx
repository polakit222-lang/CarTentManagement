import React, { useState } from "react";
import type { CarInfo, CarForSale, SaleList } from "../interface/Car";
import AdminCarCard from "./AdminCarCard";
import CustomerCarCard from "./CustomerCarCard";
import { Link } from "react-router-dom";

interface CarGridProps {
  cars?: CarInfo[];                // สำหรับ Admin
  saleList?: SaleList[];           // สำหรับ Customer
  cardType: "admin" | "customer";  // เลือก card type
  editBasePath?: string;
  addBasePath?: string;
  deleteBasePath?: string;
  rentBasePath?: string;
  sellBasePath?: string;
  detailBasePath?: string;
}

const CarGrid: React.FC<CarGridProps> = ({
  cars = [],
  saleList = [],
  cardType,
  editBasePath,
  addBasePath,
  deleteBasePath,
  rentBasePath,
  sellBasePath,
  detailBasePath,
}) => {
  const [picIndexes, setPicIndexes] = useState<Record<number, number>>({});

  const handleNext = (id: number, length: number) => {
    setPicIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + 1) % length,
    }));
  };

  const handlePrev = (id: number, length: number) => {
    setPicIndexes((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) - 1 + length) % length,
    }));
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "30px",
        padding: "20px",
        width: "100%",
      }}
    >
      {cardType === "admin" && cars.length > 0
        ? cars.map((car) => (
            <AdminCarCard
              key={car.ID}
              car={car}
              currentPicIndex={picIndexes[car.ID] ?? 0}
              onNextPic={() => handleNext(car.ID, car.pictures.length)}
              onPrevPic={() => handlePrev(car.ID, car.pictures.length)}
              editPath={editBasePath ? `${editBasePath}/${car.ID}` : undefined}
              deletePath={deleteBasePath ? `${deleteBasePath}/${car.ID}` : undefined}
              rentPath={rentBasePath ? `${rentBasePath}/${car.ID}` : undefined}
              sellPath={sellBasePath ? `${sellBasePath}/${car.ID}` : undefined}
              detailPath={detailBasePath ? `${detailBasePath}/${car.ID}` : undefined}
            />
          ))
        : cardType === "customer" && saleList.length > 0
        ? saleList
            .filter((s) => s.car) // เผื่อ backend ส่ง null
            .map((s) => (
              <CustomerCarCard
                key={s.ID}
                item={{ car: s.car!, sale_price: s.sale_price }}
                detailPath={detailBasePath ? `${detailBasePath}/${s.car!.ID}` : undefined}
              />
            ))
        : (
          <p style={{ color: "#000", gridColumn: "1 / -1", textAlign: "center" }}>
            ไม่มีรถในระบบ
          </p>
        )}

      {addBasePath && cardType === "admin" && (
        <Link
          to={addBasePath}
          style={{
            border: "2px dashed #999",
            borderRadius: 8,
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2rem",
            minHeight: 300,
            width: 280,
            color: "#000",
            textDecoration: "none",
          }}
        >
          เพิ่มรายการ ➕
        </Link>
      )}
    </div>
  );
};

export default CarGrid;
