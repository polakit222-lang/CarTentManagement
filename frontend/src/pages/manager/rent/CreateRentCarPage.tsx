import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { RentPeriod, CarResponse } from '../../../interface/Rent';
import rentService from '../../../services/rentService';

const CreateRentCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarResponse | null>(null);
  const [periods, setPeriods] = useState<RentPeriod[]>([]);

  // ดึงข้อมูลรถพร้อม rent_list
  useEffect(() => {
    if (id) {
      rentService.getRentListsByCar(Number(id))
        .then((res) => {
          setCar(res);
          // ถ้ามี rent_list ใช้ของเดิม เพิ่ม temp=false, ถ้าไม่มี ใช้ array ว่าง
          setPeriods(
            res.rent_list?.length
              ? res.rent_list.map((p) => ({ ...p, temp: false }))
              : []
          );
        });
    }
  }, [id]);

  // เพิ่มช่วงเช่าใหม่
  const addPeriod = () => {
    setPeriods([
      ...periods,
      { rent_start_date: '', rent_end_date: '', rent_price: 0, temp: true },
    ]);
  };

  // ลบช่วงเช่าใน state
  const removePeriod = (index: number) => {
    setPeriods(periods.filter((_, i) => i !== index));
  };

  // ลบช่วงเช่าที่มี id (จาก backend) ด้วย
  const deletePeriod = async (p: RentPeriod, index: number) => {
    if (p.id && window.confirm('ต้องการลบช่วงเช่านี้จริงหรือไม่?')) {
      try {
        await rentService.deleteRentDate(p.id);
        removePeriod(index);
        alert('ลบเรียบร้อยแล้ว');
      } catch (err) {
        console.error(err);
        alert('ลบไม่สำเร็จ');
      }
    } else {
      // ถ้าไม่มี id แค่ลบจาก frontend
      removePeriod(index);
    }
  };

  // อัปเดตค่าใน period
  const updatePeriod = (index: number, key: keyof RentPeriod, value: string | number) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [key]: value };
    setPeriods(newPeriods);
  };

  // ส่งข้อมูลไป backend
  const handleSubmit = async () => {
    if (!car) return;

    // ส่งเฉพาะช่วงเช่าที่ถูกต้อง
    const validPeriods = periods.filter(
      (p) => p.rent_start_date && p.rent_end_date && p.rent_price > 0
    );

    if (!validPeriods.length) {
      alert('กรุณาเพิ่มช่วงเช่าที่ถูกต้อง (วันที่และราคาต้องไม่ว่าง และราคาต้อง > 0)');
      return;
    }

    try {
      await rentService.createOrUpdateRentList({
        car_id: car.id,
        status: 'Available', // สามารถปรับเป็น select input
        manager_id: 1,       // ปรับตาม context จริง
        dates: validPeriods.map((p) => ({
          id: p.id || 0, // ถ้ามี id ส่งไปเพื่อ update
          open_date: p.rent_start_date,
          close_date: p.rent_end_date,
          rent_price: p.rent_price,
        })),
      });

      alert('บันทึกเรียบร้อย');
      // reload ข้อมูลใหม่
      const refreshed = await rentService.getRentListsByCar(car.id);
      setCar(refreshed);
      setPeriods(refreshed.rent_list.map((p) => ({ ...p, temp: false })));
    } catch (err) {
      console.error(err);
      alert('บันทึกไม่สำเร็จ');
    }
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
          <button onClick={() => deletePeriod(p, i)}>ลบ</button>
        </div>
      ))}

      <button onClick={handleSubmit}>บันทึก</button>
    </div>
  );
};

export default CreateRentCarPage;
