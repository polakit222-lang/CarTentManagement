import type { CarInfo } from '../interface/Car';
import { Link } from 'react-router-dom';
import React, { useState } from 'react';

interface CarCardProps {
  car: CarInfo;
  editPath?: string;
  selectPath?: string;
  deletePath?: string;
  rentPath?: string;
  sellPath?: string;
  
  detailPath?: string; // 👈 เพิ่ม path สำหรับปุ่มรายละเอียด
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  editPath,
  selectPath,
  deletePath,
  rentPath,
  sellPath,

  detailPath, // 👈 รับ prop
}) => {
  const [currentPicIndex, setCurrentPicIndex] = useState(0);

  const handleNext = () => {
    setCurrentPicIndex((prev) =>
      prev === car.pic.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setCurrentPicIndex((prev) =>
      prev === 0 ? car.pic.length - 1 : prev - 1
    );
  };

  const currentYear = new Date().getFullYear();
  const usageAge = currentYear - (car.yearUsed ?? currentYear);

  return (
      <div
      style={{
        backgroundColor: "#1a1a1a",
        border: "2px solid gold",
        borderRadius: 12,
        padding: 12,
        width: 450,
        transition: "box-shadow 0.3s ease-in-out",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(255, 215, 0, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* รูปเลื่อน */}
      {car.pic.length > 0 && (
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src={car.pic[currentPicIndex]}
            alt={`${car.brand} ${car.model}`}
            style={{
              width: "100%",
              height: 300,
              objectFit: "cover",
              // borderRadius: 12,
              // border: "2px solid gold",
              // transition: "box-shadow 0.3s ease-in-out",
            }}
            // onMouseEnter={(e) =>
            //   (e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.4)")
            // }
            // onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          />

          <button
            onClick={handlePrev}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              transform: "translateY(-50%)",
              background: "rgba(0, 0, 0, 0.5)",
              color: "gold",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              transform: "translateY(-50%)",
              background: "rgba(0,0,0,0.5)",
              color: "gold",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </div>
      )}

      {/* ข้อมูลรถ */}
      <h3 style={{ color: "gold", marginTop: 12 }}>
        {car.brand} {car.model} {car.subModel} ปี {car.yearManufactured}
      </h3>
      <p style={{ color: "#fff" }}>ราคาซื้อ: {car.price.toLocaleString()} บาท</p>
      <p style={{ color: "#fff" }}>สภาพ: {car.condition}</p>
      <p style={{ color: "#fff" }}>เลขไมล์: {car.mileage.toLocaleString()} กิโลเมตร</p>
      <p style={{ color: "#fff" }}>อายุการใช้งาน: {usageAge} ปี</p>

      {/* ปุ่ม */}
      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        {editPath && (
          <Link to={editPath}>
            <button
              style={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
            >
              แก้ไข
            </button>
          </Link>
        )}

        {selectPath && (
          <Link to={selectPath}>
            <button
              style={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
            >
              เลือก
            </button>
          </Link>
        )}

        {deletePath && (
          <Link to={deletePath}>
            <button
              style={{
                backgroundColor: "black",
                color: "gold",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
            >
              ลบ
            </button>
          </Link>
        )}

        {rentPath&& (
          <Link to={rentPath}>
            <button
              style={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
            >
              ให้เช่า
            </button>
          </Link>
        )}

        {sellPath && (
          <Link to={sellPath}>
            <button
              style={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
            >
              ขาย
            </button>
          </Link>
        )}

        {/* ปุ่มรายละเอียด */}
        {detailPath && (
          <Link to={detailPath}>
            <button
              style={{
                backgroundColor: "gold",
                color: "black",
                fontWeight: "bold",
                border: "2px solid gold",
                borderRadius: 8,
                padding: "5px 12px",
                transition: "all 0.3s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "black";
                e.currentTarget.style.color = "gold";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "gold";
                e.currentTarget.style.color = "black";
              }}
            >
              แสดงรายละเอียด
            </button>
          </Link>
        )}
      </div>
    </div>

  );
};

export default CarCard;
