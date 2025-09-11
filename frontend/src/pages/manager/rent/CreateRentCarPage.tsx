import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { RentPeriod, CarResponse } from '../../../interface/Rent';
import rentService from '../../../services/rentService';

const CreateRentCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarResponse | null>(null);
  const [periods, setPeriods] = useState<RentPeriod[]>([]);

  useEffect(() => {
    if (id) {
      rentService.getRentListsByCar(Number(id))
        .then((res) => {
          setCar(res);
          setPeriods(res.rent_list.map((p) => ({ ...p, temp: false })));
        });
    }
  }, [id]);

  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        rent_start_date: '',
        rent_end_date: '',
        rent_price: 0,
        temp: true,
      },
    ]);
  };

  // ลบจาก state เท่านั้น
  const removePeriod = (index: number) => {
    const period = periods[index];
    if (period.temp) {
      setPeriods(periods.filter((_, i) => i !== index));
    }
  };

  // ลบจาก backend ถ้ามี id
  const deletePeriod = async (index: number) => {
    const period = periods[index];
    if (period.id && !period.temp) {
      try {
        await rentService.deleteRentDate(period.id);
        setPeriods(periods.filter((_, i) => i !== index));
      } catch (err) {
        alert('ลบช่วงเช่าไม่สำเร็จ');
        console.error(err);
      }
    } else {
      removePeriod(index);
    }
  };

  const updatePeriod = (index: number, key: keyof RentPeriod, value: string | number) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [key]: value };
    setPeriods(newPeriods);
  };

  const handleSubmit = async () => {
    if (!car) return;

    const validPeriods = periods.filter(
      (p) => p.rent_start_date && p.rent_end_date && p.rent_price > 0
    );

    if (validPeriods.length === 0) {
      alert('กรุณาเพิ่มช่วงเช่าที่ถูกต้อง (วันที่และราคาต้องไม่ว่าง และราคาต้อง > 0)');
      return;
    }

    await rentService.createOrUpdateRentList({
      car_id: car.id,
      status: 'Available',
      manager_id: 1,
      dates: validPeriods.map((p) => ({
        id: p.id || 0,
        open_date: p.rent_start_date,
        close_date: p.rent_end_date,
        rent_price: p.rent_price,
      })),
    });

    alert('บันทึกเรียบร้อย');
  };

  return (
    <div>
      <h1>สร้าง/แก้ไข Rent List สำหรับรถ {car?.car_name}</h1>

      <button onClick={addPeriod}>เพิ่มช่วงเช่า</button>

      {periods.map((p, i) => (
        <div key={i} style={{ border: '1px solid #ccc', margin: 5, padding: 5 }}>
          <input
            type="date"
            value={p.rent_start_date}
            onChange={(e) => updatePeriod(i, 'rent_start_date', e.target.value)}
          />
          <input
            type="date"
            value={p.rent_end_date}
            onChange={(e) => updatePeriod(i, 'rent_end_date', e.target.value)}
          />
          <input
            type="number"
            value={p.rent_price}
            onChange={(e) => updatePeriod(i, 'rent_price', parseFloat(e.target.value))}
          />
          <button onClick={() => deletePeriod(i)}>ลบ</button>
        </div>
      ))}

      <button onClick={handleSubmit}>บันทึก</button>
    </div>
  );
};

export default CreateRentCarPage;
