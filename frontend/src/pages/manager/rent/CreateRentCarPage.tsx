import React, { useEffect, useState } from 'react';
import { fetchRentPeriods } from '../../services/rentService';
import RentPeriodInput from '../../../components/RentPeriodInput';
import type { RentPeriod, RentListRequest } from '../../../services/rentService';
import type { CarInfo } from '../../../interface/Car';

const CreateRentCarPage: React.FC = () => {
  const [carList, setCarList] = useState<CarInfo[]>([]);
  const [selectedCar, setSelectedCar] = useState<CarInfo | null>(null);
  const [periods, setPeriods] = useState<RentPeriod[]>([]);

  useEffect(() => {
    // ดึง list รถทั้งหมดจาก backend
    fetchCars().then(setCarList); // fetchCars อยู่ใน carService
  }, []);

  useEffect(() => {
    if (selectedCar) {
      // ถ้ามีรถที่เลือก ให้ตั้ง periods เริ่มต้นจาก rent_list ของรถ
      setPeriods(selectedCar.rent_list?.map(r => ({
        start_date: r.rent_start_date,
        end_date: r.rent_end_date,
        price: r.rent_price
      })) || []);
    } else {
      setPeriods([]);
    }
  }, [selectedCar]);

  const handleSubmit = () => {
    if (!selectedCar) return;

    const request: RentListRequest = {
      carID: selectedCar.ID,
      periods: periods
    };

    // call API เพื่อบันทึก rent periods ของรถ
    saveRentList(request)
      .then(() => alert('Saved successfully'))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Create Rent Car</h2>

      <select
        value={selectedCar?.ID || ''}
        onChange={e => {
          const car = carList.find(c => c.ID === Number(e.target.value)) || null;
          setSelectedCar(car);
        }}
      >
        <option value="">-- Select Car --</option>
        {carList.map(car => (
          <option key={car.ID} value={car.ID}>
            {car.carName} ({car.yearManufacture})
          </option>
        ))}
      </select>

      {selectedCar && (
        <div style={{ marginTop: 16 }}>
          <RentPeriodInput periods={periods} setPeriods={setPeriods} />
          <button onClick={handleSubmit} style={{ marginTop: 16 }}>
            Save Rent Periods
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateRentCarPage;
