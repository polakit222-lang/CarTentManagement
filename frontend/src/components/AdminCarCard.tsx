import React, { useState } from "react";
import type { CarInfo } from "../interface/Car";
import { Link } from "react-router-dom";

interface AdminCarCardProps {
  car: CarInfo;
  currentPicIndex?: number;
  onNextPic?: () => void;
  onPrevPic?: () => void;
  editPath?: string;
  deletePath?: string;
  rentPath?: string;
  sellPath?: string;
  detailPath?: string;
}

const AdminCarCard: React.FC<AdminCarCardProps> = ({
  car,
  currentPicIndex = 0,
  onNextPic,
  onPrevPic,
  editPath,
  deletePath,
  rentPath,
  sellPath,
  detailPath,
}) => {
  const [localIndex, setLocalIndex] = useState(currentPicIndex);

  const handleNext = () => {
    if (car.pictures.length === 0) return;
    const nextIndex = (localIndex + 1) % car.pictures.length;
    setLocalIndex(nextIndex);
    onNextPic?.();
  };

  const handlePrev = () => {
    if (car.pictures.length === 0) return;
    const prevIndex = (localIndex - 1 + car.pictures.length) % car.pictures.length;
    setLocalIndex(prevIndex);
    onPrevPic?.();
  };

  const brandName = car.detail?.Brand?.brand_name ?? "-";
  const modelName = car.detail?.CarModel?.ModelName ?? "-";
  const subModelName = car.detail?.SubModel?.SubModelName ?? "-";

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, width: 280, boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
      <h3>{car.car_name}</h3>
      <p>ปี: {car.year_manufacture}</p>
      <p>สี: {car.color}</p>
      <p>ระยะทาง: {car.mileage} km</p>
      <p>สภาพ: {car.condition}</p>
      <p>แบรนด์: {brandName}</p>
      <p>โมเดล: {modelName}</p>
      <p>ซับโมเดล: {subModelName}</p>

      {car.pictures.length > 0 && (
        <>
          <img
            src={car.pictures[localIndex]?.path}
            alt={car.pictures[localIndex]?.title}
            style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 4 }}
          />
          <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
            {car.pictures.map((pic, idx) => (
              <img
                key={pic.ID}
                src={pic.path}
                alt={pic.title}
                style={{
                  width: 60,
                  height: 40,
                  objectFit: "cover",
                  border: idx === localIndex ? "2px solid #1976d2" : "1px solid #aaa",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
                onClick={() => setLocalIndex(idx)}
              />
            ))}
          </div>
        </>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 10 }}>
        {editPath && (
          <Link
            to={editPath}
            style={{ flex: 1, padding: "5px 10px", backgroundColor: "#1976d2", color: "#fff", textAlign: "center", borderRadius: 4, textDecoration: "none" }}
          >
            แก้ไข
          </Link>
        )}
        {deletePath && (
          <Link
            to={deletePath}
            style={{ flex: 1, padding: "5px 10px", backgroundColor: "#d32f2f", color: "#fff", textAlign: "center", borderRadius: 4, textDecoration: "none" }}
          >
            ลบ
          </Link>
        )}
        {rentPath && (
          <Link
            to={rentPath}
            style={{ flex: 1, padding: "5px 10px", backgroundColor: "#388e3c", color: "#fff", textAlign: "center", borderRadius: 4, textDecoration: "none" }}
          >
            ให้เช่า
          </Link>
        )}
        {sellPath && (
          <Link
            to={sellPath}
            style={{ flex: 1, padding: "5px 10px", backgroundColor: "#fbc02d", color: "#000", textAlign: "center", borderRadius: 4, textDecoration: "none" }}
          >
            ขาย
          </Link>
        )}
        {detailPath && (
          <Link
            to={detailPath}
            style={{ flex: 1, padding: "5px 10px", backgroundColor: "#757575", color: "#fff", textAlign: "center", borderRadius: 4, textDecoration: "none" }}
          >
            รายละเอียด
          </Link>
        )}
      </div>
    </div>
  );
};

export default AdminCarCard;
