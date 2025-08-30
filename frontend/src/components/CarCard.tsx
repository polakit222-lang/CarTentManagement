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
}

const CarCard: React.FC<CarCardProps> = ({
  car,
  editPath,
  selectPath,
  deletePath,
  rentPath,
  sellPath,
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

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 10 ,width:450 }}>
      {/* รูปเลื่อน */}
      {car.pic.length > 0 && (
        <div style={{ position: 'relative', textAlign: 'center'}}>
          <img
            src={car.pic[currentPicIndex]}
            alt={`${car.brand} ${car.model}`}
            style={{
              width: '100%',
              height: 300,
              objectFit: 'cover',
              borderRadius: 8,
            }}
          />
          <button
            onClick={handlePrev}
            style={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            style={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            ›
          </button>
        </div>
      )}

      <h3>{car.brand} {car.model} {car.subModel} ปี {car.yearManufactured}</h3>
      <p>ราคาซื้อ: {car.price.toLocaleString()} บาท</p>
      <p>สภาพ: {car.condition}</p>
      <p>เลขไมล์: {car.mileage.toLocaleString()} กิโลเมตร</p>
      <p>อายุการใช้งาน: {car.yearUsed} ปี</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        {editPath && <Link to={editPath}><button>แก้ไข</button></Link>}
        {selectPath && <Link to={selectPath}><button>เลือก</button></Link>}
        {deletePath && <Link to={deletePath}><button>ลบ</button></Link>}
        {rentPath && <Link to={rentPath}><button>ให้เช่า</button></Link>}
        {sellPath && <Link to={sellPath}><button>ขาย</button></Link>}
      </div>
    </div>
  );
};

export default CarCard;