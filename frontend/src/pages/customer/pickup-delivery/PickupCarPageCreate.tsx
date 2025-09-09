import React, { useState, useEffect, useMemo } from 'react';
import {
  Select, Button, Space, Row, Col, Input,
  Typography, Divider, message, Spin
} from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { useAuth } from '../../../hooks/useAuth';

import "../../../style/global.css";
import '../../../style/inspecstyle.css';
import CustomDatePicker from '../../../components/datetimepicker';
import provinces from '../../../data/thailand-address.json';
import { timeOptions } from '../../../data/data';

dayjs.locale('th');

const { Title, Text } = Typography;

interface Employee {
  ID: number;
  first_name: string;
  last_name: string;
}

interface TypeInformation {
  ID: number;
  type: string;
}

interface SalesContract {
    ID: number;
}

interface Province {
    ProvinceName: string;
}
interface District {
    DistrictName: string;
}
interface SubDistrict {
    SubDistrictName: string;
}

interface PickupDeliveryFromDB {
    ID: number;
    DateTime: string;
    Status: string;
}

interface PickupDeliveryForEdit {
    ID: number;
    DateTime: string;
    Address: string;
    SalesContract: SalesContract;
    Employee: Employee;
    TypeInformation: TypeInformation;
    Province?: Province;
    District?: District;
    SubDistrict?: SubDistrict;
}

const PickupCarCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editingId = searchParams.get('id');

  const { user, token } = useAuth();

  const [loading, setLoading] = useState<boolean>(!!editingId);
  const [bookedTimeSlots, setBookedTimeSlots] = useState<string[]>([]);

  // Form state
  const [contractNumber, setContractNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);
  const [selectedMethodId, setSelectedMethodId] = useState<number | undefined>(undefined);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [typeInformations, setTypeInformations] = useState<TypeInformation[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedSubdistrict, setSelectedSubdistrict] = useState<string | null>(null);

  const inputStyle = {
    backgroundColor: '#4A4A4A',
    color: 'white',
    borderColor: '#888'
  };

  const districtOptions = useMemo(() => {
    if (!selectedProvince) return [];
    const province = provinces.find(p => p.name_th === selectedProvince);
    return province ? province.amphure.map(a => ({ value: a.name_th, label: a.name_th })) : [];
  }, [selectedProvince]);

  const subdistrictOptions = useMemo(() => {
    if (!selectedDistrict) return [];
    const province = provinces.find(p => p.name_th === selectedProvince);
    const district = province?.amphure.find(a => a.name_th === selectedDistrict);
    return district ? district.tambon.map(t => ({ value: t.name_th, label: t.name_th })) : [];
  }, [selectedProvince, selectedDistrict]);

  const selectedMethodName = useMemo(() =>
    typeInformations.find(t => t.ID === selectedMethodId)?.type,
    [typeInformations, selectedMethodId]
  );

  const isSaveDisabled =
    !contractNumber ||
    !selectedDate ||
    !selectedTime ||
    !selectedEmployeeId ||
    !selectedMethodId ||
    (selectedMethodName === 'ให้ไปส่งตามที่อยู่' && (!address || !selectedProvince || !selectedDistrict || !selectedSubdistrict));

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [empResponse, typeResponse] = await Promise.all([
          fetch('http://localhost:8080/employees'),
          fetch('http://localhost:8080/type-informations')
        ]);
        if (!empResponse.ok || !typeResponse.ok) throw new Error('Failed to fetch initial data');
        const empData = await empResponse.json();
        const typeData = await typeResponse.json();
        setEmployees(empData);
        setTypeInformations(typeData);
      } catch (error) {
        console.error(error);
        message.error("เกิดข้อผิดพลาดในการดึงข้อมูลเริ่มต้น");
      }
    };

    const fetchBookingDataForEdit = async () => {
      if (!editingId || !token) return;
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/pickup-deliveries/${editingId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('ไม่พบข้อมูลการนัดหมาย');

        const { data }: { data: PickupDeliveryForEdit } = await response.json();

        setContractNumber(data.SalesContract.ID.toString());
        setSelectedEmployeeId(data.Employee.ID);
        setSelectedMethodId(data.TypeInformation.ID);
        const bookingDateTime = dayjs(data.DateTime);
        setSelectedDate(bookingDateTime);
        setSelectedTime(bookingDateTime.format('HH:mm'));

        if (data.Address) {
            setAddress(data.Address);
        }
        if (data.Province) {
            setSelectedProvince(data.Province.ProvinceName);
        }
        if (data.District) {
            setSelectedDistrict(data.District.DistrictName);
        }
        if (data.SubDistrict) {
            setSelectedSubdistrict(data.SubDistrict.SubDistrictName);
        }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        message.error(`เกิดข้อผิดพลาด: ${error.message}`);
        navigate('/pickup-car');
      } finally {
        setLoading(false);
      }
    };

    fetchDropdownData().then(() => {
        if (editingId) {
            fetchBookingDataForEdit();
        } else {
            setLoading(false);
        }
    });

  }, [editingId, token, navigate]);

  useEffect(() => {
    if (user && user.ID) {
      setCustomerId(Number(user.ID));
    }
  }, [user]);

  useEffect(() => {
    const fetchBookedTimes = async () => {
      if (!selectedDate) return;

      try {
        const response = await fetch('http://localhost:8080/pickup-deliveries');
        if (!response.ok) throw new Error('Failed to fetch bookings');

        const bookings: PickupDeliveryFromDB[] = (await response.json()).data || [];

        const unavailableTimes = bookings
          .filter(booking => {
            if (editingId && booking.ID.toString() === editingId) {
                return false;
            }
            return dayjs(booking.DateTime).isSame(selectedDate, 'day');
          })
          .map(booking => dayjs(booking.DateTime).format('HH:mm'));

        setBookedTimeSlots(unavailableTimes);

      } catch (error) {
        console.error(error);
        message.error("ไม่สามารถดึงข้อมูลเวลาที่จองแล้วได้");
      }
    };

    fetchBookedTimes();
  }, [selectedDate, editingId]);


  const handleSave = async () => {
    if (!customerId) {
        message.error("ข้อมูลผู้ใช้ไม่ถูกต้อง กรุณาลองเข้าสู่ระบบใหม่อีกครั้ง");
        return;
    }
    if (isSaveDisabled) {
        message.warning("กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
        return;
    }

    const pickupDateTime = selectedDate!
        .hour(parseInt(selectedTime!.split(':')[0]))
        .minute(parseInt(selectedTime!.split(':')[1]))
        .second(0);

    const payload = {
        CustomerID: customerId,
        EmployeeID: selectedEmployeeId!,
        TypeInformationID: selectedMethodId!,
        SalesContractNumber: parseInt(contractNumber, 10),
        PickupDate: pickupDateTime.format(),
        Address: selectedMethodName === 'ให้ไปส่งตามที่อยู่' ? address : "",
        Province: selectedMethodName === 'ให้ไปส่งตามที่อยู่' ? (selectedProvince || "") : "",
        District: selectedMethodName === 'ให้ไปส่งตามที่อยู่' ? (selectedDistrict || "") : "",
        Subdistrict: selectedMethodName === 'ให้ไปส่งตามที่อยู่' ? (selectedSubdistrict || "") : "",
    };

    try {
        const url = editingId
            ? `http://localhost:8080/pickup-deliveries/${editingId}`
            : 'http://localhost:8080/pickup-deliveries';
        
        const method = editingId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            message.success(editingId ? 'แก้ไขการนัดหมายสำเร็จ!' : 'สร้างการนัดหมายสำเร็จ!');
            navigate('/pickup-car');
        } else {
            const errorData = await response.json();
            message.error(`บันทึกไม่สำเร็จ: ${errorData.error || 'กรุณาตรวจสอบข้อมูลอีกครั้ง'}`);
        }
    } catch (error) {
        console.error('Failed to save booking:', error);
        message.error('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
  };


  const disabledDate = (current: Dayjs): boolean => {
    const now = dayjs();
    if (current && current.isBefore(now, 'day')) return true;
    if (now.hour() >= 12 && current && current.isSame(now, 'day')) return true;
    return false;
  };

  if (loading) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" />
        </div>
    );
  }

  // --- vvvvv --- เพิ่ม CSS สำหรับ Placeholder --- vvvvv ---
  const customCss = `
    .ant-select-selection-placeholder {
        color: #a9a9a9 !important; /* สีเทาเข้ม */
    }
    .ant-input::placeholder {
        color: #a9a9a9 !important; /* สีเทาเข้ม */
    }
  `;
  // --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ ---

  return (
    <div style={{ padding: '24px 48px' }}>
      {/* --- vvvvv --- เพิ่ม Tag Style เพื่อให้ CSS ทำงาน --- vvvvv --- */}
      <style>{customCss}</style>
       <style>{`
        .ant-select-selection-item {
          color: #FFFFFF !important;
        }
        
      `}</style>
      {/* --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ --- */}
      <div style={{ minHeight: 'calc(100vh - 180px)', padding: 24 }}>
        <Row justify="center">
          <Col xs={24} sm={22} md={20} lg={18} xl={16}>
            <Title level={2} style={{ color: 'white' }}>{editingId ? 'แก้ไข' : 'สร้าง'}การนัดหมายรับรถยนต์</Title>
            <Divider style={{ borderColor: '#424242' }} />

            <Title level={4} style={{ color: '#f1d430ff' }}>ข้อมูลการนัดหมาย</Title>
            <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>หมายเลขสัญญาซื้อขาย</Text></Col>
              <Col xs={24} sm={16}><Input placeholder="กรอกหมายเลขสัญญา" value={contractNumber} onChange={e => setContractNumber(e.target.value)} style={inputStyle} /></Col>

              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>เลือกพนักงาน</Text></Col>
              <Col xs={24} sm={16}><Select
                placeholder="เลือกพนักงาน"
                value={selectedEmployeeId}
                style={{ width: '100%' }}
                onChange={setSelectedEmployeeId}
                options={employees?.map(emp => ({
                  value: emp.ID,
                  label: `${emp.first_name} ${emp.last_name}`
                }))}
              /></Col>

              <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>วิธีการรับรถ</Text></Col>
              <Col xs={24} sm={16}><Select
                placeholder="เลือกวิธีการรับรถ"
                value={selectedMethodId}
                style={{ width: '100%' }}
                onChange={setSelectedMethodId}
                options={typeInformations?.map(type => ({
                  value: type.ID,
                  label: type.type
                }))}
              /></Col>
            </Row>

            <Title level={4} style={{ color: 'white' }}>เลือกวันเวลานัดหมาย</Title>
            <div style={{ background: '#4A4A4A', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
              <CustomDatePicker
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate as (date: Dayjs) => void}
                disabledDate={disabledDate}
              />
              <div style={{ padding: '24px' }}>
                <Row gutter={[16, 16]}>
                  {timeOptions.map((time, index) => {
                    const isBooked = bookedTimeSlots.includes(time);
                    return (
                      <Col xs={12} sm={8} md={6} key={index}>
                        <Button
                          disabled={isBooked}
                          style={{
                            width: '100%',
                            height: '50px',
                            background: selectedTime === time ? '#f1d430ff' : 'transparent',
                            color: selectedTime === time ? 'black' : isBooked ? '#888' : 'white',
                            borderColor: selectedTime === time ? '#f1d430ff' : isBooked ? '#555' : '#ddd',
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

            {selectedMethodName === 'ให้ไปส่งตามที่อยู่' && (
              <>
                <Title level={4} style={{ color: 'white' }}>ข้อมูลที่อยู่สำหรับจัดส่ง</Title>
                <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
                  <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>ที่อยู่ (บ้านเลขที่, หมู่, ซอย, ถนน)</Text></Col>
                  <Col xs={24} sm={16}><Input.TextArea placeholder="รายละเอียดที่อยู่" value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} /></Col>

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
                    <Select showSearch placeholder="เลือกตำบล/แขวง" value={selectedSubdistrict} style={{ width: '100%' }} onChange={setSelectedSubdistrict} disabled={!selectedDistrict} options={subdistrictOptions} />
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
                    background: 'linear-gradient(45deg, #FFD700, #FFA50A)',
                    color: 'black',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: isSaveDisabled ? 'not-allowed' : 'pointer',
                    opacity: isSaveDisabled ? 0.5 : 1,
                  }}
                  onClick={handleSave}
                >
                  {editingId ? 'บันทึกการแก้ไข' : 'บันทึก'}
                </Button>
                <Button
                  type="default"
                  style={{ width: '120px', height: '40px', background: 'transparent', borderColor: '#888', color: '#888' }}
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