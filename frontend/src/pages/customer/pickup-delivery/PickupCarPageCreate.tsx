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

// --- vvvvv --- นี่คือส่วนที่แก้ไข --- vvvvv ---
// 1. ลบการ import `empItems` จาก `data.ts`
import { timeOptions, typeItems } from '../../../data/data';
// 2. Import `mockEmployees` จาก `users.ts`
import { mockEmployees } from '../../../data/users'; 
// --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

dayjs.locale('th');

const { Title, Text } = Typography;

// --- vvvvv --- นี่คือส่วนที่แก้ไข --- vvvvv ---
// 3. แปลงข้อมูล `mockEmployees` ให้อยู่ในรูปแบบที่ <Select> ของ Ant Design ใช้งานได้
const empItems = mockEmployees.map(employee => ({
    value: employee.name,
    label: employee.name,
}));
// --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

interface PickupBooking {
  id: number;
  contractNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  employee: string | undefined;
  appointmentMethod: string | undefined;
  address?: string;
  province?: string | undefined;
  district?: string | undefined;
  subdistrict?: string | undefined;
}

const PickupCarCreatePage: React.FC = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  // Form State
  const [contractNumber, setContractNumber] = useState('');
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedEmp, setSelectedEmp] = useState<string | undefined>();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState('');

  // Address State
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>();
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string | undefined>();

  // State for disabling save button
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  // Dynamic options for address dropdowns using the correct property names
  const districtOptions = useMemo(() => {
    if (!selectedProvince) return [];
    const province = provinces.find(p => p.name_th === selectedProvince);
    return province ? province.amphure.map(d => ({ value: d.name_th, label: d.name_th })) : [];
  }, [selectedProvince]);

  const subdistrictOptions = useMemo(() => {
    if (!selectedProvince || !selectedDistrict) return [];
    const province = provinces.find(p => p.name_th === selectedProvince);
    const district = province?.amphure.find(d => d.name_th === selectedDistrict);
    return district ? district.tambon.map(s => ({ value: s.name_th, label: s.name_th })) : [];
  }, [selectedProvince, selectedDistrict]);

  // Validation Effect to enable/disable save button
  useEffect(() => {
    const isBasicInfoMissing = !selectedType || !contractNumber || !selectedEmp || !selectedDate || !selectedTime;

    if (isBasicInfoMissing) {
      setIsSaveDisabled(true);
      return;
    }

    if (selectedType === 'จัดส่งรถถึงที่') {
      const isAddressInfoMissing = !address || !selectedProvince || !selectedDistrict || !selectedSubdistrict;
      setIsSaveDisabled(isAddressInfoMissing);
    } else {
      setIsSaveDisabled(false);
    }
  }, [selectedType, contractNumber, selectedEmp, selectedDate, selectedTime, address, selectedProvince, selectedDistrict, selectedSubdistrict]);


  // Effect for editing existing booking
  useEffect(() => {
    if (editingId) {
      const storedBookings: PickupBooking[] = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
      const bookingToEdit = storedBookings.find((b) => b.id === parseInt(editingId));
      if (bookingToEdit) {
        setContractNumber(bookingToEdit.contractNumber);
        setSelectedType(bookingToEdit.appointmentMethod);
        setSelectedEmp(bookingToEdit.employee);
        setSelectedDate(dayjs(bookingToEdit.appointmentDate, 'DD MMMM YYYY', 'th'));
        setSelectedTime(bookingToEdit.appointmentTime.split(' ')[0]);
        setAddress(bookingToEdit.address || '');
        setSelectedProvince(bookingToEdit.province);
        // Using setTimeout to allow dependent dropdowns to populate before setting the value
        setTimeout(() => {
          setSelectedDistrict(bookingToEdit.district);
          setTimeout(() => {
            setSelectedSubdistrict(bookingToEdit.subdistrict);
          }, 0);
        }, 0);
      }
    }
  }, [editingId]);

  // Handlers
  const handleProvinceChange = (value: string) => {
    setSelectedProvince(value);
    setSelectedDistrict(undefined);
    setSelectedSubdistrict(undefined);
  };

  const handleDistrictChange = (value: string) => {
    setSelectedDistrict(value);
    setSelectedSubdistrict(undefined);
  };

  const handleSave = () => {
    const storedBookings: PickupBooking[] = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
    const newBooking: PickupBooking = {
      id: editingId ? parseInt(editingId) : Date.now(),
      contractNumber,
      appointmentMethod: selectedType,
      employee: selectedEmp,
      appointmentDate: selectedDate!.locale('th').format('DD MMMM YYYY'),
      appointmentTime: `${selectedTime} - ${dayjs(selectedTime!, 'HH:mm').add(1, 'hour').format('HH:mm')} น.`,
      address: selectedType === 'จัดส่งรถถึงที่' ? address : '',
      province: selectedType === 'จัดส่งรถถึงที่' ? selectedProvince : undefined,
      district: selectedType === 'จัดส่งรถถึงที่' ? selectedDistrict : undefined,
      subdistrict: selectedType === 'จัดส่งรถถึงที่' ? selectedSubdistrict : undefined,
    };

    const updatedBookings = editingId
      ? storedBookings.map((b) => (b.id === newBooking.id ? newBooking : b))
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
            <Title level={2} style={{ color: 'white' }}>{editingId ? 'แก้ไข' : 'สร้าง'}การนัดหมายรับรถยนต์</Title>
            <Divider style={{ borderColor: '#424242' }} />

            <Title level={4} style={{ color: '#f1d430ff' }}>ข้อมูลการนัดหมาย</Title>
            <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>เลือกประเภทการรับรถยนต์</Text></Col>
              <Col xs={24} sm={16}><Select placeholder="เลือกประเภท" value={selectedType} style={{ width: '100%' }} onChange={setSelectedType} options={typeItems} /></Col>
              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>หมายเลขสัญญาซื้อขาย</Text></Col>
              <Col xs={24} sm={16}><Input placeholder="กรอกหมายเลขสัญญา" value={contractNumber} onChange={e => setContractNumber(e.target.value)} /></Col>
              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>พนักงานที่ดูแล</Text></Col>
              <Col xs={24} sm={16}><Select placeholder="เลือกพนักงาน" value={selectedEmp} style={{ width: '100%' }} onChange={setSelectedEmp} options={empItems} /></Col>
            </Row>
            
            <Title level={4} style={{ color: 'white' }}>เลือกวันเวลานัดหมาย</Title>
            <div style={{ background: '#4A4A4A', padding: '0', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
              <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate as (date: Dayjs) => void} />
              <div style={{ padding: '24px' }}>
                <Row gutter={[16, 16]}>
                  {timeOptions.map((time, index) => (
                    <Col xs={12} sm={8} md={6} key={index}>
                      <Button
                        style={{
                          width: '100%',
                          height: '50px',
                          background: selectedTime === time ? '#f1d430ff' : 'transparent',
                          color: selectedTime === time ? 'black' : 'white',
                          borderColor: selectedTime === time ? '#f1d430ff' : '#ddd',
                          borderRadius: '6px'
                        }}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>

            {selectedType === 'จัดส่งรถถึงที่' && (
              <>
                <Title level={4} style={{ color: 'white' }}>ที่อยู่สำหรับจัดส่ง</Title>
                <Text style={{ color: '#cccccc', display: 'block', marginBottom: '10px' }}>สำหรับลูกค้าที่เลือกให้เต้นท์ขับรถยนต์นำไปส่งที่บ้านลูกค้า</Text>
                <Input.TextArea placeholder="กรอกที่อยู่" rows={4} value={address} onChange={e => setAddress(e.target.value)} style={{ marginBottom: '20px' }} />
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={8}>
                    <Text style={{ color: 'white' }}>จังหวัด</Text>
                    <Select showSearch placeholder="เลือกจังหวัด" value={selectedProvince} style={{ width: '100%', marginTop: '8px' }} onChange={handleProvinceChange} options={provinces.map(p => ({ value: p.name_th, label: p.name_th }))} />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text style={{ color: 'white' }}>อำเภอ/เขต</Text>
                    <Select showSearch placeholder="เลือกอำเภอ/เขต" value={selectedDistrict} style={{ width: '100%', marginTop: '8px' }} onChange={handleDistrictChange} disabled={!selectedProvince} options={districtOptions} />
                  </Col>
                  <Col xs={24} sm={8}>
                    <Text style={{ color: 'white' }}>ตำบล/แขวง</Text>
                    <Select showSearch placeholder="เลือกตำบล/แขวง" value={selectedSubdistrict} style={{ width: '100%', marginTop: '8px' }} onChange={setSelectedSubdistrict} disabled={!selectedDistrict} options={subdistrictOptions} />
                  </Col>
                </Row>
              </>
            )}

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