import React, { useState, useEffect } from 'react';
import {
    Button, Card, Row, Col, Space, Modal,
    Typography, Divider, Empty, message
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircleOutlined, EditOutlined, CalendarOutlined,
    ClockCircleOutlined, BuildOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(buddhistEra);

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

const InspectionCarPage: React.FC = () => {

    const navigate = useNavigate();

    const [bookingHistory, setBookingHistory] = useState<InspectionBooking[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<InspectionBooking | null>(null);

    useEffect(() => {
        const storedBookings = localStorage.getItem('inspectionBookings');
        if (storedBookings) {
            setBookingHistory(JSON.parse(storedBookings));
        }
    }, []);

    

    const handleCreateNewBooking = () => navigate('/inspection-create');

    
    //ถ้าอีก60นาทีถึงจะสามารถแก้ไขหรือยกเลิกได้
    const isActionDisabled = (booking: InspectionBooking) => {
        const appointmentDateTime = dayjs(`${booking.appointmentDate} ${booking.appointmentTime.split(' ')[0]}`, 'DD MMMM YYYY HH:mm', 'th');
        const now = dayjs();
        const diffInMinutes = appointmentDateTime.diff(now, 'minute');
        return diffInMinutes <= 60;
    };

    const handleEditBooking = (booking: InspectionBooking) => {
        if (isActionDisabled(booking)) {
            message.error('ไม่สามารถแก้ไขการนัดหมายที่เหลือเวลาน้อยกว่า 60 นาทีได้');
            return;
        }
        navigate(`/inspection-car/create?id=${booking.id}`);
    };

    const handleCancelBooking = (booking: InspectionBooking) => {
        if (isActionDisabled(booking)) {
            message.error('ไม่สามารถยกเลิกการนัดหมายที่เหลือเวลาน้อยกว่า 60 นาทีได้');
            return;
        }
        setBookingToCancel(booking);
        setIsModalOpen(true);
    };
    //-------------------------------------------

    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            const updatedBookings = bookingHistory.filter(b => b.id !== bookingToCancel.id);
            setBookingHistory(updatedBookings);
            localStorage.setItem('inspectionBookings', JSON.stringify(updatedBookings));
            setIsModalOpen(false);
            setBookingToCancel(null);
            message.success('ยกเลิกการนัดหมายสำเร็จ!');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setBookingToCancel(null);
    };

    return (
        <div style={{ padding: '0 48px' }}>

            <div style={{ minHeight: 'calc(100vh - 180px)', padding: 24 }}>
                <Row align="middle" justify="space-between">
                    <Col><Title level={2} style={{ color: 'white', marginBottom: 0 }}>ประวัติการนัดตรวจสภาพรถยนต์</Title></Col>
                    <Col>
                        <Button type="primary" icon={<PlusCircleOutlined />} style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none', fontWeight: 'bold' }} onClick={handleCreateNewBooking}>
                            สร้างการนัดหมายใหม่
                        </Button>
                    </Col>
                </Row>
                <Divider style={{ borderColor: '#424242' }} />

                {bookingHistory.length > 0 ? (
                    <Row gutter={[0, 24]} justify="center">
                        <Col xs={24} sm={20} md={16} lg={12}>
                            {bookingHistory.map((booking) => (
                                <Card
                                    key={booking.id}
                                    style={{
                                        width: '100%',
                                        backgroundColor: '#363636',
                                        color: 'white',
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                        marginBottom: '24px',
                                        border: '1px solid #f1d846ff',
                                    }}
                                >
                                    <Title level={5} style={{ color: 'white', marginBottom: '24px' }}>
                                        หมายเลขสัญญาซื้อขาย: <Text style={{ color: '#f1d430ff' }}>{booking.contractNumber}</Text>
                                    </Title>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '30px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <CalendarOutlined style={{ fontSize: '24px', color: '#f1d430ff', marginRight: '16px' }} />
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>วันนัดหมาย</Text>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{booking.appointmentDate}</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <ClockCircleOutlined style={{ fontSize: '24px', color: '#f1d430ff', marginRight: '16px' }} />
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>เวลานัดหมาย</Text>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{booking.appointmentTime}</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <BuildOutlined style={{ fontSize: '24px', color: '#f1d430ff', marginRight: '16px' }} />
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>ระบบที่ต้องการตรวจสอบ</Text>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{booking.system}</Text>
                                            </div>
                                        </div>
                                    </div>
                                    {!isActionDisabled(booking) && (
                                        <Space style={{ width: '100%', justifyContent: 'center' }}>
                                            <Button
                                                icon={<EditOutlined />}
                                                style={{ backgroundColor: '#f1d430ff', color: 'black', border: 'none' }}
                                                onClick={() => handleEditBooking(booking)}
                                            >
                                                แก้ไข
                                            </Button>
                                            <Button
                                                icon={<CloseCircleOutlined />}
                                                danger
                                                onClick={() => handleCancelBooking(booking)}
                                            >
                                                ยกเลิก
                                            </Button>
                                        </Space>
                                    )}
                                </Card>
                            ))}
                        </Col>
                    </Row>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '100px' }}>
                        <Empty description={<Text style={{ color: '#777' }}>ยังไม่มีประวัติการนัดหมาย</Text>}>
                            <Button type="primary" style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none', fontWeight: 'bold' }} onClick={handleCreateNewBooking}>สร้างการนัดหมายแรกของคุณ</Button>
                        </Empty>
                    </div>
                )}
            </div>

            <Modal title="ยืนยันการยกเลิก" open={isModalOpen} onCancel={handleModalClose} footer={[
                <Button key="back" onClick={handleModalClose}>กลับ</Button>,
                <Button key="submit" type="primary" danger onClick={handleConfirmCancel}>ยืนยันการยกเลิก</Button>
            ]}>
                <p>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกการนัดหมายนี้?</p>
            </Modal>
        </div>
    );
};

export default InspectionCarPage;

