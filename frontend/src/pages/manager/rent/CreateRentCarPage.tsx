// src/pages/manager/rent/CreateRentCarPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Image, DatePicker, InputNumber, Button, Card, Row, Col, message } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // ✅ import dayjs ถูกต้อง
import type { CarResponse, RentPeriod } from '../../../interface/Rent';
import rentService from '../../../services/rentService';
const { RangePicker } = DatePicker;

interface RentPeriodWithRange extends RentPeriod {
  range?: [Dayjs | null, Dayjs | null];
}

const CreateRentCarPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [car, setCar] = useState<CarResponse | null>(null);
  const [periods, setPeriods] = useState<RentPeriodWithRange[]>([]);

  useEffect(() => {
    if (id) {
      rentService.getRentListsByCar(Number(id)).then((res) => {
        setCar(res);
        setPeriods(
          res.rent_list.map((p) => ({
            ...p,
            temp: false,
            range: [
              p.rent_start_date ? dayjs(p.rent_start_date) : null,
              p.rent_end_date ? dayjs(p.rent_end_date) : null,
            ],
          }))
        );
      });
    }
  }, [id]);

  const addPeriod = () => {
    setPeriods([
      ...periods,
      {
        rent_price: 0,
        temp: true,
        rent_start_date: '',
        rent_end_date: '',
        range: [null, null],
      },
    ]);
  };

  const removePeriod = async (index: number) => {
    if (!car) return;
    const period = periods[index];
    if (period.id) {
      try {
        await rentService.deleteRentDate(period.id);
        message.success('ลบช่วงเช่าสำเร็จ');
        setPeriods(periods.filter((_, i) => i !== index));
      } catch (err) {
        console.error(err);
        message.error('ลบช่วงเช่าไม่สำเร็จ');
      }
    } else {
      setPeriods(periods.filter((_, i) => i !== index));
    }
  };

  const updatePeriod = (index: number, key: keyof RentPeriodWithRange, value: any) => {
    const newPeriods = [...periods];
    newPeriods[index] = { ...newPeriods[index], [key]: value };
    setPeriods(newPeriods);
  };

  const handleRangeChange = (index: number, dates: [Dayjs | null, Dayjs | null] | null) => {
    updatePeriod(index, 'range', dates);
    if (dates) {
      updatePeriod(index, 'rent_start_date', dates[0]?.format('YYYY-MM-DD') || '');
      updatePeriod(index, 'rent_end_date', dates[1]?.format('YYYY-MM-DD') || '');
    }
  };

  const handleSubmit = async () => {
    if (!car) return;
    const validPeriods = periods.filter(
      (p) => p.rent_start_date && p.rent_end_date && p.rent_price > 0
    );
    if (validPeriods.length === 0) {
      message.warning('กรุณาเพิ่มช่วงเช่าที่ถูกต้อง (วันที่และราคาต้องไม่ว่าง และราคาต้อง > 0)');
      return;
    }
    try {
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
      message.success('บันทึกเรียบร้อย');

      // refresh data หลังบันทึก
      const res = await rentService.getRentListsByCar(car.id);
      setCar(res);
      setPeriods(
        res.rent_list.map((p) => ({
          ...p,
          temp: false,
          range: [
            p.rent_start_date ? dayjs(p.rent_start_date) : null,
            p.rent_end_date ? dayjs(p.rent_end_date) : null,
          ],
        }))
      );
    } catch (err) {
      console.error(err);
      message.error('บันทึกไม่สำเร็จ');
    }
  };

  const renderThumbnails = () => {
    if (!car) return null;
    const pics = [...(car.pictures || [])];
    while (pics.length < 5) pics.push({ id: 0, path: 'placeholder.png', title: 'Placeholder' });
    return (
      <Row gutter={8} style={{ marginBottom: 16 }}>
        {pics.slice(0, 5).map((pic) => (
          <Col key={pic.id || pic.path}>
            <Image
              width={120}
              height={120}
              src={`http://localhost:8080/images/cars/${pic.path}`}
              alt={pic.title}
              style={{ objectFit: 'cover', borderRadius: 5 }}
              preview={{ mask: <div>{pic.title}</div> }}
            />
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div>
      {car && (
        <Card title={`สร้าง/แก้ไข Rent List สำหรับรถ ${car.car_name}`} bordered>
          {/* Section 1: รูป */}
          <h3>รูปตัวอย่างรถ</h3>
          {renderThumbnails()}

          {/* Section 2: ข้อมูลรถ */}
          <h3>ข้อมูลรถ</h3>
          <Row gutter={16}>
            <Col span={8}>ปีผลิต: {car.year_manufacture}</Col>
            <Col span={8}>สี: {car.color}</Col>
            <Col span={8}>ระยะทาง: {car.mileage} km</Col>
            <Col span={8}>สภาพ: {car.condition}</Col>
          </Row>

          {/* Section 3: Rent List */}
          <h3>ช่วงเช่า</h3>
          <Button type="primary" onClick={addPeriod} style={{ marginBottom: 10 }}>
            เพิ่มช่วงเช่า
          </Button>

          {periods.map((p, i) => (
            <Card key={i} size="small" style={{ marginBottom: 8 }}>
              <RangePicker
                value={p.range as [Dayjs, Dayjs]}
                onChange={(dates) => handleRangeChange(i, dates)}
              />
              <InputNumber
                min={0}
                value={p.rent_price}
                onChange={(value) => updatePeriod(i, 'rent_price', value || 0)}
                style={{ marginLeft: 8 }}
              />
              <Button danger onClick={() => removePeriod(i)} style={{ marginLeft: 8 }}>
                ลบ
              </Button>
            </Card>
          ))}

          <Button type="primary" onClick={handleSubmit} style={{ marginTop: 10 }}>
            บันทึก
          </Button>
        </Card>
      )}
    </div>
  );
};

export default CreateRentCarPage;
