import React, { useState, useEffect } from 'react';
import {
    Button, Space, Row, Col, Input, Typography, Divider, message
} from 'antd';
import { CarOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import { useNavigate, useSearchParams } from 'react-router-dom';

import CustomDatePicker from '../../../components/datetimepicker';
import InspectionCard from '../../../components/PickupCarCard';
import { timeOptions } from '../../../data/data';

dayjs.locale('th');

const { Title, Text } = Typography;

// Define an interface for the booking object
interface InspectionBooking {
    id: number;
    contractNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    system: string;
    firstName?: string;
    lastName?: string;
    message?: string;
}

const inspectionItems = [
    { label: "ยางและระบบช่วงล่างรถยนต์", icon: <CarOutlined /> },
    { label: "ระบบเบรก", icon: <CarOutlined /> },
    { label: "ระบบแอร์และหม้อน้ำ", icon: <CarOutlined /> },
    { label: "ไฟหน้าและไฟท้าย", icon: <CarOutlined /> },
    { label: "น้ำมันเครื่องและไส้กรอง", icon: <CarOutlined /> },
    { label: "แบตเตอรี่", icon: <CarOutlined /> },
    { label: "ของเหลวต่างๆ", icon: <CarOutlined /> },
    { label: "ไฟส่องสว่าง", icon: <CarOutlined /> },
];

const InspectionCreatePage: React.FC = () => {
    
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editingId = searchParams.get('id');
    // --- บรรทัดที่เพิ่มเข้ามา ---
    const [bookedTimes, setBookedTimes] = useState<string[]>([]);

    // Form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [contractNumber, setContractNumber] = useState('');
    const [messageText, setMessageText] = useState('');
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedSystems, setSelectedSystems] = useState<string[]>([]);
    const [isSaveDisabled, setIsSaveDisabled] = useState(true);

    // Validation Effect
    useEffect(() => {
        const isInfoMissing = !firstName || !lastName || !contractNumber || !selectedDate || !selectedTime;
        const isSystemSelected = selectedSystems.length > 0;

        if (isInfoMissing || !isSystemSelected) {
            setIsSaveDisabled(true);
        } else {
            setIsSaveDisabled(false);
        }
    }, [firstName, lastName, contractNumber, selectedDate, selectedTime, selectedSystems]);
    // Effect to check for booked times on the selected date
    useEffect(() => {
        if (selectedDate) {
            const storedBookings: InspectionBooking[] = JSON.parse(localStorage.getItem('inspectionBookings') || '[]');
            const formattedDate = selectedDate.locale('th').format('DD MMMM YYYY');

            // --- vvvvv --- ส่วนที่แก้ไข --- vvvvv ---
            // ดึงเวลาการจองทั้งหมดในวันที่เลือก
            const allBookedTimes = storedBookings
                .filter(booking => booking.appointmentDate === formattedDate)
                .map(booking => booking.appointmentTime.split(' ')[0]);

            // นับจำนวนการจองในแต่ละช่วงเวลา
            const timeCounts = allBookedTimes.reduce((acc, time) => {
                acc[time] = (acc[time] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // กรองเฉพาะเวลาที่มีการจองตั้งแต่ 3 ครั้งขึ้นไป
            const fullyBookedTimes = Object.keys(timeCounts).filter(time => timeCounts[time] >= 3);

            setBookedTimes(fullyBookedTimes);
            // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---
        }
    }, [selectedDate]);

    // Effect for editing existing booking
    useEffect(() => {
        if (editingId) {
            const storedBookings: InspectionBooking[] = JSON.parse(localStorage.getItem('inspectionBookings') || '[]');
            const bookingToEdit = storedBookings.find((b) => b.id === parseInt(editingId));
            if (bookingToEdit) {
                setFirstName(bookingToEdit.firstName || '');
                setLastName(bookingToEdit.lastName || '');
                setContractNumber(bookingToEdit.contractNumber || '');
                setMessageText(bookingToEdit.message || '');
                setSelectedDate(dayjs(bookingToEdit.appointmentDate, 'DD MMMM YYYY', 'th'));
                setSelectedTime(bookingToEdit.appointmentTime.split(' ')[0]);
                setSelectedSystems(bookingToEdit.system ? bookingToEdit.system.split(' ') : []);
            }
        }
    }, [editingId]);

    const handleSystemSelect = (label: string) => {
        setSelectedSystems(prev =>
            prev.includes(label) ? prev.filter(item => item !== label) : [...prev, label]
        );
    };
    
    const handleSave = () => {
        const storedBookings: InspectionBooking[] = JSON.parse(localStorage.getItem('inspectionBookings') || '[]');
        const newBooking: InspectionBooking = {
            id: editingId ? parseInt(editingId) : Date.now(),
            firstName,
            lastName,
            contractNumber,
            message: messageText,
            appointmentDate: selectedDate ? selectedDate.locale('th').format('DD MMMM YYYY') : '',
            appointmentTime: selectedTime ? `${selectedTime} - ${dayjs(selectedTime, 'HH:mm').add(1, 'hour').format('HH:mm')} น.` : '',
            system: selectedSystems.join(' '),
        };

        const updatedBookings = editingId
            ? storedBookings.map((b) => (b.id === newBooking.id ? newBooking : b))
            : [...storedBookings, newBooking];
        
        localStorage.setItem('inspectionBookings', JSON.stringify(updatedBookings));
        message.success(editingId ? 'บันทึกการแก้ไขเรียบร้อย!' : 'สร้างการนัดหมายสำเร็จ!');
        navigate('/inspection-car');
    };

    const handleCancel = () => {
        navigate('/inspection-car');
    };

    return (
        <div style={{ padding: '24px 48px' }}>
            <div style={{ minHeight: 'calc(100vh - 180px)', padding: 24}}>
                <Row justify="center">
                    <Col xs={24} sm={22} md={20} lg={18} xl={16}>
                        <Title level={2} style={{ color: 'white' }}>{editingId ? 'แก้ไข' : 'สร้าง'}การนัดหมายตรวจสภาพรถยนต์</Title>
                        <Divider style={{ borderColor: '#424242' }} />

                        <Title level={4} style={{ color: '#f1d430ff' }}>ข้อมูลลูกค้า</Title>
                        <Row align="middle" gutter={[16, 20]} style={{ marginBottom: '40px' }}>
                            <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>ชื่อ</Text></Col>
                            <Col xs={24} sm={16}><Input placeholder="กรอกชื่อ" value={firstName} onChange={e => setFirstName(e.target.value)} /></Col>
                            
                            <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>นามสกุล</Text></Col>
                            <Col xs={24} sm={16}><Input placeholder="กรอกนามสกุล" value={lastName} onChange={e => setLastName(e.target.value)} /></Col>

                            <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>หมายเลขสัญญาซื้อขาย</Text></Col>
                            <Col xs={24} sm={16}><Input placeholder="กรอกหมายเลขสัญญา" value={contractNumber} onChange={e => setContractNumber(e.target.value)} /></Col>

                            <Col xs={24} sm={8} style={{ textAlign: 'left' }}><Text style={{ color: 'white' }}>ข้อความแจ้งช่าง (ถ้ามี)</Text></Col>
                            <Col xs={24} sm={16}><Input.TextArea placeholder="รายละเอียดเพิ่มเติม" value={messageText} onChange={e => setMessageText(e.target.value)} /></Col>
                        </Row>

                        <Title level={4} style={{ color: 'white' }}>เลือกวันเวลานัดหมาย</Title>
                        <div style={{ background: '#4A4A4A', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '40px' }}>
                            <CustomDatePicker selectedDate={selectedDate} setSelectedDate={setSelectedDate as (date: Dayjs) => void} />
                            <div style={{ padding: '24px' }}>
                                <Row gutter={[16, 16]}>
                                    {timeOptions.map((time, index) => {
                                        // --- บรรทัดที่เพิ่มเข้ามา ---
                                        const isBooked = bookedTimes.includes(time);
                                        const isSelected = selectedTime === time;

                                        return (
                                            <Col xs={12} sm={8} md={6} key={index}>
                                                <Button
                                                    // --- บรรทัดที่เพิ่มเข้ามา ---
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
                        
                        <Title level={4} style={{ color: 'white' }}>เลือกรายการที่ต้องการตรวจ</Title>
                        <div style={{ background: '#4A4A4A', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                            <Row gutter={[16, 16]}>
                                {inspectionItems.map(item => (
                                    <Col xs={12} sm={8} md={6} key={item.label}>
                                        <InspectionCard 
                                            label={item.label} 
                                            iconType={item.icon}
                                            isSelected={selectedSystems.includes(item.label)}
                                            onSelect={() => handleSystemSelect(item.label)}
                                        />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        
                        <Row justify="center" style={{ marginTop: '60px' }}>
                            <Space size="middle">
                                <Button 
                                  disabled={isSaveDisabled}
                                  style={{ 
                                    width: '120px', 
                                    height: '40px',
                                    background: 'linear-gradient(45deg, #FFD700, #FFA500)', 
                                    color:'black', 
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
                                  onClick={handleCancel}
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
export default InspectionCreatePage;