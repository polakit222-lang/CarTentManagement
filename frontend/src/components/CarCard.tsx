import React from 'react';
import type { BaseCar } from '../interface/Car';
import '../style/CarCard.css';

interface CarCardProps {
  car: BaseCar;
  type: 'sale' | 'rent';
  salePrice?: number; // เพิ่มเพื่อแสดงราคาขาย
}

const CarCard: React.FC<CarCardProps> = ({ car, type, salePrice }) => {
  return (
    <div className="car-card">
      {car.pictures && car.pictures.length > 0 ? (
        <img src={car.pictures[0].path} alt={car.pictures[0].title} className="car-image" />
      ) : (
        <div className="car-image placeholder">No Image</div>
      )}
      <div className="car-info">
        <h3>{car.car_name}</h3>
        <p>สี: {car.color}</p>
        <p>ปีผลิต: {car.year_manufacture}</p>
        <p>เลขไมล์: {car.mileage}</p>
        <p>สภาพ: {car.condition}</p>
        {salePrice && <p className="car-price">ราคาซื้อ: {salePrice.toLocaleString()} บาท</p>}
      </div>
    </div>
  );
};

export default CarCard;
