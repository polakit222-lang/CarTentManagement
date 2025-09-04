// src/pages/customer/pickup-delivery/PickupCarPageCreate.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
  Select, Button, Space, Row, Col, Input,
  Typography, Divider, message
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useNavigate, useSearchParams } from 'react-router-dom';

import "../../../style/global.css";
import '../../../style/inspecstyle.css';
import CustomDatePicker from '../../../components/datetimepicker';
import provinces from '../../../data/thailand-address.json';
import { timeOptions, typeItems } from '../../../data/data';
import { mockEmployees } from '../../../data/users';

dayjs.locale('th');

const { Title, Text } = Typography;

const empItems = mockEmployees.map(employee => ({
    value: employee.name,
    label: employee.name,
}));

interface PickupBooking {
    id: number;
    contractNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    employee: string | undefined;
    appointmentMethod: string | undefined;
    address?: string;
    province?: string;
    district?: string;
    subdistrict?: string;
    status?: string;
}

const PickupCarCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);

  // Form state
  const [contractNumber, setContractNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string | undefined>(undefined);
  const [selectedMethod, setSelectedMethod] = useState<string | undefined>(undefined);
  const [address, setAddress] = useState('');

  // Dropdown options
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string | null>(null);

  const districtOptions = useMemo(() => {
    const province = provinces.find(p => p.name_th === selectedProvince);
    return province ? province.amphure.map(a => ({ value: a.name_th, label: a.name_th })) : [];
  }, [selectedProvince]);

  const subdistrictOptions = useMemo(() => {
    const province = provinces.find(p => p.name_th === selectedProvince);
    const district = province?.amphure.find(a => a.name_th === selectedDistrict);
    return district ? district.tambon.map(t => ({ value: t.name_th, label: t.name_th })) : [];
  }, [selectedProvince, selectedDistrict]);

  const isSaveDisabled = !contractNumber || !selectedDate || !selectedTime || !selectedEmployee || !selectedMethod || (selectedMethod === 'จัดส่ง' && (!address || !selectedProvince || !selectedDistrict || !selectedSubdistrict));

  useEffect(() => {
    if (selectedDate) {
        const storedBookings: PickupBooking[] = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
        const formattedDate = selectedDate.locale('th').format('DD MMMM YYYY');

        const allBookedTimes = storedBookings
            .filter(booking => booking.appointmentDate === formattedDate && booking.status !== 'ยกเลิก')
            .map(booking => booking.appointmentTime.split(' ')[0]);

        const timeCounts = allBookedTimes.reduce((acc, time) => {
            acc[time] = (acc[time] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const fullyBookedTimes = Object.keys(timeCounts).filter(time => timeCounts[time] >= 1);

        setBookedTimes(fullyBookedTimes);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (editingId) {
      const storedBookings: PickupBooking[] = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
      const bookingToEdit = storedBookings.find(b => b.id === parseInt(editingId));
      if (bookingToEdit) {
        setContractNumber(bookingToEdit.contractNumber);
        setSelectedDate(dayjs(bookingToEdit.appointmentDate, 'DD MMMM YYYY', 'th'));
        setSelectedTime(bookingToEdit.appointmentTime.split(' ')[0]);
        setSelectedEmployee(bookingToEdit.employee);
        setSelectedMethod(bookingToEdit.appointmentMethod);
        setAddress(bookingToEdit.address || '');
        setSelectedProvince(bookingToEdit.province || null);
        setSelectedDistrict(bookingToEdit.district || null);
        setSelectedSubdistrict(bookingToEdit.subdistrict || null);
      }
    }
  }, [editingId]);

  const handleSave = () => {
    const storedBookings: PickupBooking[] = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
    const newBooking: PickupBooking = {
      id: editingId ? parseInt(editingId) : Date.now(),
      contractNumber,
      appointmentDate: selectedDate ? selectedDate.locale('th').format('DD MMMM YYYY') : '',
      appointmentTime: selectedTime ? `${selectedTime} - ${dayjs(selectedTime, 'HH:mm').add(1, 'hour').format('HH:mm')} น.` : '',
      employee: selectedEmployee,
      appointmentMethod: selectedMethod,
      address,
      province: selectedProvince || undefined,
      district: selectedDistrict || undefined,
      subdistrict: selectedSubdistrict || undefined,
      status: 'รอตรวจสอบ',
    };

    const updatedBookings = editingId
      ? storedBookings.map(b => (b.id === newBooking.id ? newBooking : b))
      : [...storedBookings, newBooking];

    localStorage.setItem('pickupBookings', JSON.stringify(updatedBookings));
    message.success(editingId ? 'บันทึกการแก้ไขเรียบร้อย!' : 'สร้างการนัดหมายสำเร็จ!');
    navigate('/pickup-car');
  };

  return (
    <div style={{ padding: '24px 48px' }}>
      <div style={{ minHeight: 'calc(100vh - 180px)', padding: 24 }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={18} xl={16}>
            <Title level={2} style={{ color: 'white' }}>{editingId ? 'แก้ไข' : 'สร้าง'}การนัดหมายรับรถ</Title>
            <Divider style={{ borderColor: '#424242' }} />

            <Title level={4} style={{ color: '#f1d430ff' }}>ข้อมูลการนัดหมาย</Title>
            <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>หมายเลขสัญญาซื้อขาย</Text></Col>
              <Col xs={24} sm={16}><Input placeholder="กรอกหมายเลขสัญญา" value={contractNumber} onChange={e => setContractNumber(e.target.value)} /></Col>

              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>เลือกพนักงาน</Text></Col>
              <Col xs={24} sm={16}><Select placeholder="เลือกพนักงาน" value={selectedEmployee} style={{ width: '100%' }} onChange={setSelectedEmployee} options={empItems} /></Col>

              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>วิธีการรับรถ</Text></Col>
              <Col xs={24} sm={16}><Select placeholder="เลือกวิธีการรับรถ" value={selectedMethod} style={{ width: '100%' }} onChange={setSelectedMethod} options={typeItems} /></Col>
            </Row>

            <Title level={4} style={{ color: 'white' }}>เลือกวันเวลานัดหมาย</Title>
            <div style={{ background: '#4A4A4A', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate as (date: Dayjs) => void} />
                <div style={{ padding: '24px' }}>
                    <Row gutter={[16, 16]}>
                        {timeOptions.map((time, index) => {
                            const isBooked = bookedTimes.includes(time);
                            const isSelected = selectedTime === time;
                            return (
                                <Col xs={12} sm={8} md={6} key={index}>
                                    <Button
                                        disabled={isBooked}
                                        style={{
                                            width: '100%',
                                            height: '50px',
                                            background: isSelected ? '#f1d430ff' : 'transparent',
                                            color: isSelected ? 'black' : isBooked ? '#888' : 'white',
                                            borderColor: isSelected ? '#f1d430ff' : isBooked ? '#555' : '#ddd',
                                            borderRadius: '6px',
                                            cursor: isBooked ? 'not-allowed' : 'pointer',
                                        }}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </Button>
                                </Col>
                            );
                        })}
                    </Row>
                </div>
            </div>
            
            {/* --- vvvvv --- ส่วนที่แก้ไข --- vvvvv --- */}
            {selectedMethod === 'จัดส่งรถถึงที่' && (
              <>
                <Title level={4} style={{ color: 'white' }}>ข้อมูลที่อยู่สำหรับจัดส่ง</Title>
                <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
                  <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)</Text></Col>
                  <Col xs={24} sm={16}><Input.TextArea placeholder="รายละเอียดที่อยู่" value={address} onChange={e => setAddress(e.target.value)} /></Col>

                  <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>จังหวัด</Text></Col>
                  <Col xs={24} sm={16}>
                    <Select showSearch placeholder="เลือกจังหวัด" value={selectedProvince} style={{ width: '100%' }} onChange={setSelectedProvince} options={provinces.map(p => ({ value: p.name_th, label: p.name_th }))} />
                  </Col>

                  <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>อำเภอ/เขต</Text></Col>
                  <Col xs={24} sm={16}>
                    <Select showSearch placeholder="เลือกอำเภอ/เขต" value={selectedDistrict} style={{ width: '100%' }} onChange={setSelectedDistrict} disabled={!selectedProvince} options={districtOptions} />
                  </Col>

                  <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>ตำบล/แขวง</Text></Col>
                  <Col xs={24} sm={16}>
                    <Select showSearch placeholder="เลือกตำบล/แขวง" value={selectedSubdistrict} style={{ width: '100%'}} onChange={setSelectedSubdistrict} disabled={!selectedDistrict} options={subdistrictOptions} />
                  </Col>
                </Row>
              </>
            )}
            {/* --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ --- */}

            <Row justify="center" style={{ marginTop: '60px' }}>
              <Space size="middle">
                <Button
                  disabled={isSaveDisabled}
                  style={{
                    width: '120px',
                    height: '40px',
                    background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                    color: 'black',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                  }}
                  onClick={handleSave}
                >
                  บันทึก
                </Button>
                <Button
                  type="default"
                  style={{
                    width: '120px',
                    height: '40px',
                    background: 'transparent',
                    borderColor: '#888',
                    color: '#888'
                  }}
                  onClick={() => navigate('/pickup-car')}
                >
                  ยกเลิก
                </Button>
              </Space>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PickupCarCreatePage;