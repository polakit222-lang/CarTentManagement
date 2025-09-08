import React from 'react';
import type { CarInfo, CarType } from '../interface/Car';
import CarCard from './CarCard';
import '../style/CarGrid.css';

interface CarGridProps {
  cars: CarInfo[];
 type: 'sale' | 'rent';
  detailBasePath?: string;
}

const CarGrid: React.FC<CarGridProps> = ({ cars, type }) => {
  return (
    <div className="car-grid">
      {cars.map((c) => (
        <CarCard
          key={c.car.ID}
          car={c.car}
          type={type}
          salePrice={c.sale_price}
        />
      ))}
    </div>
  );
};

export default CarGrid;
