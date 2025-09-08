import React, { useState } from "react";
import type { CarForSale } from "../interface/Car";

interface CustomerCarCardProps {
  item: CarForSale;
   detailPath?: string;
}

const CustomerCarCard: React.FC<CustomerCarCardProps> = ({ item }) => {
  const [currentPicIndex, setCurrentPicIndex] = useState(0);

  if (!item.car.pictures || item.car.pictures.length === 0) return null;

  const handleNext = () => setCurrentPicIndex((prev) => (prev + 1) % item.car.pictures.length);
  const handlePrev = () =>
    setCurrentPicIndex((prev) => (prev - 1 + item.car.pictures.length) % item.car.pictures.length);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, width: 280, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h3>{item.car.car_name}</h3>
      <p style={{ fontWeight: "bold", color: "#d32f2f" }}>ราคาขาย: {item.sale_price.toLocaleString()} บาท</p>
      <p>ปี: {item.car.year_manufacture}</p>
      <p>สี: {item.car.color}</p>
      <p>ระยะทาง: {item.car.mileage} km</p>
      <p>สภาพ: {item.car.condition}</p>

      <img
        src={item.car.pictures[currentPicIndex]?.path}
        alt={item.car.pictures[currentPicIndex]?.title}
        style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }}
      />

      <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
        {item.car.pictures.map((pic, idx) => (
          <img
            key={pic.ID}
            src={pic.path}
            alt={pic.title}
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              border: idx === currentPicIndex ? "2px solid #1976d2" : "1px solid #aaa",
              borderRadius: 4,
              cursor: "pointer",
            }}
            onClick={() => setCurrentPicIndex(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomerCarCard;
