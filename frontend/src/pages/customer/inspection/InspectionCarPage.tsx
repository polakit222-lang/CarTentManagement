// src/pages/customer/inspection/InspectionCarPage.tsx

import React, { useState, useEffect, useMemo } from 'react';
import {
    Button, Card, Row, Col, Space, Modal,
    Typography, Divider, Empty, message, Select,
    Spin, ConfigProvider
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    PlusCircleOutlined, EditOutlined, CalendarOutlined,
    ClockCircleOutlined, BuildOutlined, CloseCircleOutlined,
    CheckCircleOutlined, LoadingOutlined, SortAscendingOutlined,
    SortDescendingOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import utc from 'dayjs/plugin/utc';
import thTH from 'antd/locale/th_TH';
import { useAuth } from '../../../hooks/useAuth';

dayjs.locale('th');
dayjs.extend(buddhistEra);
dayjs.extend(utc);

const { Title, Text } = Typography;
const { Option } = Select;

const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
  grayLight: '#424242',
};

// --- vvvvv --- START: โค้ดที่แก้ไข (1/2) --- vvvvv ---
interface InspectionBooking {
    ID: number;
    Customer: {
        ID: number;
        FirstName: string;
        LastName: string;
    };
    note: string;
    date_time: string;
    SalesContract: {
        ID: number; // แก้ไขจาก ContractNumber เป็น ID
    };
    inspection_status: string;
    InspectionSystem: { CarSystem: { system_name: string } }[];
}
// --- ^^^^^ --- END: จบส่วนที่แก้ไข --- ^^^^^ ---

const InspectionCarPage: React.FC = () => {
    
    const navigate = useNavigate();
    const [bookingHistory, setBookingHistory] = useState<InspectionBooking[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('ทั้งหมด');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState<InspectionBooking | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, token } = useAuth();

    const fetchBookings = async () => {
        if (!user || !user.ID || !token) {
            setLoading(false);
            console.error('User not logged in or ID is missing');
            message.error('กรุณาเข้าสู่ระบบเพื่อดูประวัติการนัดหมาย');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/inspection-appointments/customer/${user.ID}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setBookingHistory(data);
            } else {
                setBookingHistory([]);
            }
        } catch (error) {
            console.error('Failed to fetch inspection appointments:', error);
            message.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user, token]);

    const filteredAndSortedBookings = useMemo(() => {
        const filtered = statusFilter === 'ทั้งหมด'
            ? bookingHistory
            : bookingHistory.filter(b => b.inspection_status === statusFilter);

        return filtered.sort((a, b) => {
            const dateA = dayjs(a.date_time);
            const dateB = dayjs(b.date_time);
            if (sortOrder === 'asc') {
                return dateA.isAfter(dateB) ? 1 : -1;
            } else {
                return dateA.isBefore(dateB) ? 1 : -1;
            }
        });
    }, [bookingHistory, statusFilter, sortOrder]);

    const handleCreateNewBooking = () => {
        navigate('/inspection-create');
    };

    const handleEditBooking = (id: number) => {
        navigate(`/inspection-create?id=${id}`);
    };

    const handleCancelBooking = (booking: InspectionBooking) => {
        setBookingToCancel(booking);
        setIsModalOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (bookingToCancel) {
            try {
                const response = await fetch(`http://localhost:8080/inspection-appointments/${bookingToCancel.ID}/status`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ inspection_status: 'ยกเลิก' }),
                });

                if (response.ok) {
                    message.success('ยกเลิกการนัดหมายสำเร็จ!');
                    fetchBookings();
                } else {
                    const errorData = await response.json();
                    message.error(`ไม่สามารถยกเลิกการนัดหมายได้: ${errorData.error}`);
                }
            } catch (error) {
                console.error('Failed to cancel inspection appointment:', error);
                message.error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์เพื่อยกเลิกการนัดหมายได้');
            } finally {
                setIsModalOpen(false);
                setBookingToCancel(null);
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setBookingToCancel(null);
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'กำลังดำเนินการ':
            case 'รอตรวจสอบ':
                return <LoadingOutlined style={{ color: '#1890ff' }} />;
            case 'เสร็จสิ้น':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'ยกเลิก':
                return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <Spin size="large" />
                <p style={{ color: 'white', marginTop: '20px' }}>กำลังดึงข้อมูล...</p>
            </div>
        );
    }

    return (
        <ConfigProvider locale={thTH} theme={{
            components: {
                Select: {
                    colorBgContainer: colors.grayLight,
                    colorText: colors.gold,
                    colorBorder: colors.gold,
                    colorBgElevated: colors.gray,
                    optionSelectedBg: colors.gold,
                    optionSelectedColor: colors.black,
                    optionActiveBg: 'rgba(212, 175, 55, 0.2)',
                },
                Button: {
                    defaultBg: colors.grayLight,
                    defaultColor: colors.white,
                    defaultBorderColor: '#555',
                }
            }
        }}>
            <style>{`
                .ant-select-selector, .ant-select-dropdown {
                    color: white !important;
                }
                .ant-select-item-option-content {
                    color: black;
                }
                .ant-select-item-option-selected .ant-select-item-option-content {
                    color: black;
                }
            `}</style>
            <div style={{ padding: '24px 48px', backgroundColor: colors.black, minHeight: '100vh' }}>
                <Title level={2} style={{ color: 'white' }}>ประวัติการนัดหมายตรวจสภาพรถยนต์</Title>
                <Divider style={{ borderColor: colors.grayLight }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <Space>
                        <Text style={{ color: 'white' }}>สถานะ:</Text>
                        <Select 
                            defaultValue="ทั้งหมด"
                            style={{ width: 120 }}
                            onChange={value => setStatusFilter(value)}
                            dropdownStyle={{ backgroundColor: '#424242' }}
                        >
                            <Option value="ทั้งหมด">ทั้งหมด</Option>
                            <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
                            <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
                            <Option value="ยกเลิก">ยกเลิก</Option>
                        </Select>
                        <Button onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                            เรียงตามวันที่ {sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
                        </Button>
                    </Space>
                    <Button
                        type="primary"
                        style={{ background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none', fontWeight: 'bold' }}
                        onClick={handleCreateNewBooking}
                    >
                        <PlusCircleOutlined /> สร้างการนัดหมาย
                    </Button>
                </div>
                <div style={{ minHeight: 'calc(100vh - 280px)' }}>
                    {filteredAndSortedBookings.length > 0 ? (
                        <Row gutter={[24, 24]}>
                            {filteredAndSortedBookings.map(booking => {
                                const now = dayjs();
                                let dateTimeToParse = booking.date_time;
                                if (dateTimeToParse && dateTimeToParse.endsWith('Z')) {
                                    dateTimeToParse = dateTimeToParse.slice(0, -1);
                                }
                                const bookingDateTime = dayjs(dateTimeToParse);

                                let canModifyOrCancel = false;

                                if (booking.inspection_status !== 'ยกเลิก' && booking.inspection_status !== 'เสร็จสิ้น') {
                                    if (bookingDateTime.isAfter(now)) {
                                        if (now.isSame(bookingDateTime, 'day')) {
                                            if (bookingDateTime.diff(now, 'hour') >= 1) {
                                                canModifyOrCancel = true;
                                            }
                                        } else {
                                            canModifyOrCancel = true;
                                        }
                                    }
                                }

                                return (
                                <Col xs={24} md={12} lg={8} key={booking.ID}>
                                    <Card
                                        style={{
                                            width: '100%', backgroundColor: '#363636', color: 'white', borderRadius: '12px',
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', marginBottom: '24px', border: '1px solid #f1d846ff'
                                        }}
                                        hoverable
                                    >
                                        <Title level={4} style={{ color: '#f1d430ff', marginBottom: '16px' }}>
                                            {`นัดหมายตรวจสภาพรถยนต์ #${booking.ID}`}
                                        </Title>
                                        <Space direction="vertical" style={{ width: '100%' }}>
                                            {/* --- vvvvv --- START: โค้ดที่แก้ไข (2/2) --- vvvvv --- */}
                                            <Text style={{ color: 'white' }}>
                                                <FileTextOutlined />{' '}
                                                หมายเลขสัญญา: SC-{booking.SalesContract?.ID}
                                            </Text>
                                            {/* --- ^^^^^ --- END: จบส่วนที่แก้ไข --- ^^^^^ --- */}
                                            <Text style={{ color: 'white' }}>
                                                <CalendarOutlined />{' '}
                                                วันที่นัดหมาย: {bookingDateTime.locale('th').format('DD MMMM BBBB')}
                                            </Text>
                                            <Text style={{ color: 'white' }}>
                                                <ClockCircleOutlined />{' '}
                                                เวลา: {bookingDateTime.format('HH:mm')} น.
                                            </Text>
                                            <Text style={{ color: 'white' }}>
                                                <BuildOutlined />{' '}
                                                รายการตรวจ: {booking.InspectionSystem.map(item => item.CarSystem.system_name).join(', ')}
                                            </Text>
                                            <Text style={{ color: 'white' }}>
                                                สถานะ: {getStatusIcon(booking.inspection_status)} {booking.inspection_status}
                                            </Text>
                                        </Space>
                                        <Space style={{ marginTop: '20px' }}>
                                            {canModifyOrCancel && (
                                                <>
                                                    <Button icon={<EditOutlined />} onClick={() => handleEditBooking(booking.ID)} style={{ background: '#5e5e5e', color: 'white', borderColor: '#777' }}>
                                                        แก้ไข
                                                    </Button>
                                                    <Button icon={<CloseCircleOutlined />} danger onClick={() => handleCancelBooking(booking)}>
                                                        ยกเลิก
                                                    </Button>
                                                </>
                                            )}
                                        </Space>
                                    </Card>
                                </Col>
                            )})}
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
        </ConfigProvider>
    );
};

export default InspectionCarPage;