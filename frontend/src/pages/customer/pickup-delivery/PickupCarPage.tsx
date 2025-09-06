// src/pages/customer/pickup-delivery/PickupCarPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
    Button, Card, Row, Col, Space, Modal,
    Typography, Divider, message, Empty, Select
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircleOutlined, EditOutlined, CalendarOutlined,
    ClockCircleOutlined, UserOutlined, EnvironmentOutlined, CloseCircleOutlined,
    CheckCircleOutlined, LoadingOutlined, SortAscendingOutlined, SortDescendingOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(buddhistEra);

const { Title, Text } = Typography;
const { Option } = Select;

// --- vvvvv --- 1. แก้ไข Interface ให้มี customerId --- vvvvv ---
interface PickupBooking {
    id: number;
    customerId: number; // ID ของลูกค้าที่ทำการจอง
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
// --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

const PickupCarPage: React.FC = () => {

    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState<PickupBooking[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<PickupBooking | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('ทั้งหมด');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    // --- vvvvv --- 2. แก้ไข useEffect ให้กรองข้อมูลตาม ID ลูกค้า --- vvvvv ---
    useEffect(() => {
        const currentCustomerData = localStorage.getItem('currentCustomer');
        const storedBookingsData = localStorage.getItem('pickupBookings');

        if (currentCustomerData && storedBookingsData) {
            const currentCustomer = JSON.parse(currentCustomerData);
            const allBookings = JSON.parse(storedBookingsData);
            
            // กรองเฉพาะ booking ที่มี customerId ตรงกับ id ของลูกค้าที่ล็อกอิน
            const customerBookings = allBookings.filter(
                (booking: PickupBooking) => booking.customerId === currentCustomer.id
            );
            
            setBookingHistory(customerBookings);
        } else if (!currentCustomerData) {
            message.warning("กรุณาเข้าสู่ระบบเพื่อดูประวัติการนัดหมาย");
            navigate('/login');
        }
    }, [navigate]);
    // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

    const handleCreateNewBooking = () => navigate('/pickup-car/create');

    const isActionDisabled = (booking: PickupBooking) => {
        if (booking.status === 'เสร็จสิ้น' || booking.status === 'ยกเลิก') {
            return true;
        }
        const appointmentDateTime = dayjs(`${booking.appointmentDate} ${booking.appointmentTime.split(' ')[0]}`, 'DD MMMM YYYY HH:mm');
        return appointmentDateTime.isBefore(dayjs().add(1, 'hour'));
    };
    
    const handleEditBooking = (booking: PickupBooking) => {
        if (isActionDisabled(booking)) {
            message.error('ไม่สามารถแก้ไขการนัดหมายที่เหลือเวลาน้อยกว่า 1 ชั่วโมง หรือเสร็จสิ้น/ยกเลิกไปแล้วได้');
            return;
        }
        navigate(`/pickup-car/create?id=${booking.id}`);
    };

    const handleCancelBooking = (booking: PickupBooking) => {
        if (isActionDisabled(booking)) {
            message.error('ไม่สามารถยกเลิกการนัดหมายที่เหลือเวลาน้อยกว่า 1 ชั่วโมง หรือเสร็จสิ้น/ยกเลิกไปแล้วได้');
            return;
        }
        setBookingToCancel(booking);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (bookingToCancel) {
            const updatedBookings = bookingHistory.map(b =>
                b.id === bookingToCancel.id ? { ...b, status: 'ยกเลิก' } : b
            );
            setBookingHistory(updatedBookings);

            const allBookings = JSON.parse(localStorage.getItem('pickupBookings') || '[]');
            const globallyUpdatedBookings = allBookings.map((b: PickupBooking) => 
                b.id === bookingToCancel.id ? { ...b, status: 'ยกเลิก' } : b
            );
            localStorage.setItem('pickupBookings', JSON.stringify(globallyUpdatedBookings));

            setIsModalOpen(false);
            setBookingToCancel(null);
            message.success('ยกเลิกการนัดหมายสำเร็จ!');
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setBookingToCancel(null);
    };
    
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'เสร็จสิ้น': return '#389e0d';
            case 'ยกเลิก': return '#cf1322';
            case 'กำลังดำเนินการ': default: return '#d4b106';
        }
    };

    const getStatusIcon = (status: string) => {
        const style = { fontSize: '24px', color: getStatusColor(status), marginRight: '16px' };
        switch (status) {
            case 'เสร็จสิ้น': return <CheckCircleOutlined style={style} />;
            case 'ยกเลิก': return <CloseCircleOutlined style={style} />;
            default: return <LoadingOutlined style={style} />;
        }
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    };

    const filteredAndSortedBookings = useMemo(() => {
        const filtered = bookingHistory.filter(booking => 
            statusFilter === 'ทั้งหมด' || booking.status === statusFilter
        );
        return [...filtered].sort((a, b) => {
            const dateA = dayjs(a.appointmentDate, 'DD MMMM YYYY');
            const dateB = dayjs(b.appointmentDate, 'DD MMMM YYYY');
            return sortOrder === 'desc' ? dateB.diff(dateA) : dateA.diff(dateB);
        });
    }, [bookingHistory, statusFilter, sortOrder]);
    const customCss = `
        .ant-select-selection-item { color: white !important; }
        .ant-select-selector { border-color: #f1d430ff !important; }
        .ant-select-focused .ant-select-selector, .ant-select-selector:hover {
            border-color: #ffd700 !important;
            box-shadow: 0 0 0 2px rgba(241, 212, 48, 0.2);
        }
    `;

    return (
        <div style={{ padding: '0 48px' }}>
             <style>{customCss}</style>
            <div style={{ minHeight: 'calc(100vh - 180px)', padding: 24 }}>
                <Row align="middle" justify="space-between" gutter={[16, 16]}>
                    <Col>
                        <Title level={2} style={{ color: ' #FFD700', marginBottom: 0 }}>ประวัติการนัดหมายรับรถยนต์</Title>
                    </Col>
                    <Col>
                        <Button type="primary" icon={<PlusCircleOutlined />} style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none', fontWeight: 'bold' }} onClick={handleCreateNewBooking}>
                            สร้างการนัดหมายใหม่
                        </Button>
                    </Col>
                </Row>
                
                <Row justify="start" style={{ marginTop: 24, marginBottom: 24 }} gutter={16}>
                    <Col>
                        <Text style={{ color: 'white', marginRight: 8 }}>สถานะ:</Text>
                        <Select
                            value={statusFilter}
                            onChange={(value) => setStatusFilter(value)}
                            style={{ width: 150 }}
                            className="custom-select"
                        >
                            <Option value="ทั้งหมด">ทั้งหมด</Option>
                            <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
                            <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
                            <Option value="ยกเลิก">ยกเลิก</Option>
                        </Select>
                    </Col>
                    <Col>
                        <Button onClick={toggleSortOrder} icon={sortOrder === 'desc' ? <SortDescendingOutlined /> : <SortAscendingOutlined />}>
                            เรียงตามวันที่นัดหมาย {sortOrder === 'desc' ? '(ล่าสุดก่อน)' : '(เก่าสุดก่อน)'}
                        </Button>
                    </Col>
                </Row>

                <Divider style={{ borderColor: '#424242' }} />

                {filteredAndSortedBookings.length > 0 ? (
                    <Row gutter={[0, 24]} justify="center">
                        <Col xs={24} sm={20} md={16} lg={12}>
                            {filteredAndSortedBookings.map((booking) => (
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
                                            {getStatusIcon(booking.status || 'กำลังดำเนินการ')}
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>สถานะ</Text>
                                                <Text style={{ color: getStatusColor(booking.status || 'กำลังดำเนินการ'), fontWeight: 'bold' }}>{booking.status || 'กำลังดำเนินการ'}</Text>
                                            </div>
                                        </div>
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
                                            <UserOutlined style={{ fontSize: '24px', color: '#f1d430ff', marginRight: '16px' }} />
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>พนักงาน</Text>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{booking.employee}</Text>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <EnvironmentOutlined style={{ fontSize: '24px', color: '#f1d430ff', marginRight: '16px' }} />
                                            <div>
                                                <Text style={{ color: '#aaaaaa', display: 'block' }}>วิธีการรับรถ</Text>
                                                <Text style={{ color: 'white', fontWeight: 'bold' }}>{booking.appointmentMethod}</Text>
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
                        <Empty description={<Text style={{ color: '#777' }}>{statusFilter === 'ทั้งหมด' ? 'ยังไม่มีประวัติการนัดหมาย' : 'ไม่พบรายการนัดหมายตามสถานะที่เลือก'}</Text>}>
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

export default PickupCarPage;