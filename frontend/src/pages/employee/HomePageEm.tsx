// src/pages/employee/HomePageEm.tsx
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Typography, Tag, Button, Statistic, Progress, Divider, Timeline, Calendar, Badge, Tooltip } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { CarOutlined, TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined, IssuesCloseOutlined, ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

// ตั้งค่า Day.js สำหรับภาษาไทยและปี พ.ศ.
dayjs.locale('th');
dayjs.extend(buddhistEra);


const { Title, Text, Paragraph } = Typography;

// --- ข้อมูลจำลอง (Mockup Data) ---

interface CarSell {
    id: number;
    carName: string;
    price: number;
    date: string; // Format 'YYYY-MM-DD'
    employee: string;
}

const mockCarSellList: CarSell[] = [
    { id: 1, carName: 'Toyota Camry', price: 850000, date: '2025-09-04', employee: 'สมชาย' },
    { id: 2, carName: 'Honda Civic', price: 780000, date: '2025-09-03', employee: 'สมศรี' },
    { id: 3, carName: 'Ford Ranger', price: 920000, date: '2025-09-01', employee: 'สมชาย' },
    { id: 4, carName: 'Isuzu D-Max', price: 890000, date: '2025-08-15', employee: 'สมชาย' },
];

const mockLeaveHistory = [
  { id: 1, employee: 'สมชาย', date: '2025-09-10', status: 'Approved' },
  { id: 2, employee: 'สมศรี', date: '2025-09-12', status: 'Pending' },
];

const SALES_TARGET = 2_000_000;

// --- Interface สำหรับข้อมูลนัดหมาย ---

interface PickupBooking {
    id: number;
    contractNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    employee: string | undefined;
    appointmentMethod?: string | undefined;
    status?: string;
    address?: string;
    province?: string;
    district?: string;
    subdistrict?: string;
}

// --- ฟังก์ชันสำหรับแปลงวันที่ภาษาไทย ---

const parseThaiDate = (thaiDate: string): Date | null => {
    const months: { [key: string]: number } = {
        'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3,
        'พฤษภาคม': 4, 'มิถุนายน': 5, 'กรกฎาคม': 6, 'สิงหาคม': 7,
        'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
    };
    
    const parts = thaiDate.split(' ');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        return new Date(year, month, day);
    }
    return null;
};


// --- คอมโพเนนท์หลัก ---

const HomePageEm: React.FC = () => {
    const { user } = useAuth();
    const [allAppointments, setAllAppointments] = useState<PickupBooking[]>([]);
    const [displayedAppointments, setDisplayedAppointments] = useState<PickupBooking[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [employeeLeaveHistory, setEmployeeLeaveHistory] = useState<(typeof mockLeaveHistory)>([]);
    const [salesSummary, setSalesSummary] = useState({ totalSales: 0, carsSold: 0, recentSales: [] as CarSell[] });
    const sortAppointments = (appointments: PickupBooking[]): PickupBooking[] => {
        return [...appointments].sort((a, b) => {
            const dateA = parseThaiDate(a.appointmentDate)?.getTime() || 0;
            const dateB = parseThaiDate(b.appointmentDate)?.getTime() || 0;
            if (dateA !== dateB) return dateA - dateB;
            
            const timeA = parseInt(a.appointmentTime.split(':')[0]);
            const timeB = parseInt(b.appointmentTime.split(':')[0]);
            return timeA - timeB;
        });
    };
    useEffect(() => {
        let employeeBookings: PickupBooking[] = [];
        if (user) {
            // 1. ดึงข้อมูลนัดหมายทั้งหมดของพนักงานที่ล็อกอิน
            const storedBookings = localStorage.getItem('pickupBookings');
            if (storedBookings) {
                try {
                    const allBookings: PickupBooking[] = JSON.parse(storedBookings);
                    employeeBookings = allBookings.filter(app => app.employee === user.name);
                    setAllAppointments(employeeBookings);
                } catch (error) {
                    console.error("Failed to parse bookings", error);
                }
            }

            // 2. กรองข้อมูลนัดหมายที่จะแสดงผลเริ่มต้น (-3 ถึง +3 วัน)
            const today = dayjs();
            const startDate = today.subtract(3, 'day').startOf('day');
            const endDate = today.add(3, 'day').endOf('day');
            
            const initialFiltered = employeeBookings.filter(booking => {
                const appointmentDate = parseThaiDate(booking.appointmentDate);
                return appointmentDate && dayjs(appointmentDate).isBetween(startDate, endDate, null, '[]');
            }).sort((a, b) => {
                const dateA = parseThaiDate(a.appointmentDate)?.getTime() || 0;
                const dateB = parseThaiDate(b.appointmentDate)?.getTime() || 0;
                if(dateA !== dateB) return dateA - dateB;
                const timeA = parseInt(a.appointmentTime.split(':')[0]);
                const timeB = parseInt(b.appointmentTime.split(':')[0]);
                return timeA - timeB;
            });
            setDisplayedAppointments(initialFiltered);

            // 3. คำนวณยอดขาย
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth();
            const currentYear = currentDate.getFullYear();
            const employeeSales = mockCarSellList.filter(sale => {
                const saleDate = new Date(sale.date);
                return sale.employee === user.name &&
                       saleDate.getMonth() === currentMonth &&
                       saleDate.getFullYear() === currentYear;
            });
            const totalSales = employeeSales.reduce((sum, sale) => sum + sale.price, 0);
            const carsSold = employeeSales.length;
            const recentSales = employeeSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
            setSalesSummary({ totalSales, carsSold, recentSales });

            // 4. ดึงข้อมูลการลา
            setEmployeeLeaveHistory(mockLeaveHistory.filter(h => h.employee === user.name));
        }
    }, [user]);
    
    // --- ฟังก์ชันสำหรับ Calendar ---
    const dateCellRender = (date: Dayjs) => {
        const hasAppointment = allAppointments.some(app => {
            const appDate = parseThaiDate(app.appointmentDate);
            return appDate && dayjs(appDate).isSame(date, 'day');
        });
        const leaveOnDate = employeeLeaveHistory.find(leave => dayjs(leave.date).isSame(date, 'day'));

        return (
            <ul className="events" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {hasAppointment && (
                    <li>
                        <Badge status="processing" />
                    </li>
                )}
                {leaveOnDate && (
                    <li>
                        <Badge status={leaveOnDate.status === 'Approved' ? 'success' : 'warning'} text="วันลา" />
                    </li>
                )}
            </ul>
        );
    };

       const handleDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
        const selected = allAppointments.filter(app => {
            const appDate = parseThaiDate(app.appointmentDate);
            return appDate && dayjs(appDate).isSame(date, 'day');
        });
        setDisplayedAppointments(sortAppointments(selected)); // ใช้ฟังก์ชัน Sort
    };

    const clearFilter = () => {
        setSelectedDate(null);
        const today = dayjs();
        const startDate = today.subtract(3, 'day').startOf('day');
        const endDate = today.add(3, 'day').endOf('day');
        
        const initialFiltered = allAppointments.filter(booking => {
            const appointmentDate = parseThaiDate(booking.appointmentDate);
            return appointmentDate && dayjs(appointmentDate).isBetween(startDate, endDate, null, '[]');
        });
        
        setDisplayedAppointments(sortAppointments(initialFiltered)); // เพิ่มการเรียงลำดับที่นี่
    };
    const salesProgress = Math.round((salesSummary.totalSales / SALES_TARGET) * 100);

    const getLeaveStatusIcon = (status?: string) => {
        switch (status) {
            case 'Approved': return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />;
            case 'Pending': return <ClockCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />;
            default: return <IssuesCloseOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />;
        }
    };

    const groupedAppointments = displayedAppointments.reduce((acc, appointment) => {
        const date = appointment.appointmentDate;
        if (!acc[date]) acc[date] = [];
        acc[date].push(appointment);
        return acc;
    }, {} as Record<string, PickupBooking[]>);

    return (
        <div style={{ padding: '24px', background: '#f5f5f5' }}>
            <Title level={3} style={{ color: 'white', marginBottom: '24px',marginTop: '90px' }}>Welcome, {user?.name || 'Employee'}</Title>
            
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card bordered={false} style={{ height: '100%' }}>
                        <Row align="middle" gutter={24}>
                            <Col xs={24} md={12}>
                                <Title level={4}>สรุปยอดขายเดือนนี้</Title>
                                <Paragraph type="secondary">อัปเดตล่าสุด: {dayjs().format('D MMMM BBBB')}</Paragraph>
                                <Statistic title="ยอดขายรวม" value={salesSummary.totalSales} precision={0} prefix="฿" valueStyle={{ color: '#3f8600', fontSize: '2.5rem' }} />
                                <Statistic title="จำนวนรถที่ขายได้" value={salesSummary.carsSold} prefix={<CarOutlined />} valueStyle={{ color: '#1890ff' }} suffix="คัน" />
                            </Col>
                            <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                <Progress type="dashboard" percent={salesProgress} format={(percent) => `${percent}%`} strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }} width={180} />
                                <Title level={5} style={{ marginTop: '16px' }}>เป้าหมายยอดขาย</Title>
                                <Text type="secondary">{new Intl.NumberFormat('th-TH').format(SALES_TARGET)} บาท</Text>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                    <Card bordered={false} title={<><TrophyOutlined /> รายการขายล่าสุด</>} style={{ height: '100%' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={salesSummary.recentSales}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta title={<Text strong>{item.carName}</Text>} description={`ราคา: ${item.price.toLocaleString()} บาท`} />
                                    <Text type="secondary">{dayjs(item.date).format('D MMM')}</Text>
                                </List.Item>
                            )}
                            locale={{ emptyText: 'ยังไม่มีรายการขายในเดือนนี้' }}
                        />
                    </Card>
                </Col>
            </Row>

            <Divider />

            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <Card 
                        bordered={false} 
                        title="ตารางนัดหมาย" 
                        style={{ height: '100%' }}
                        extra={selectedDate && (
                            <Tooltip title="ล้างตัวกรอง">
                                <Button type="text" icon={<ClearOutlined />} onClick={clearFilter}>
                                    แสดงช่วงเวลาปกติ
                                </Button>
                            </Tooltip>
                        )}
                    >
                        {displayedAppointments.length > 0 ? (
                             <Timeline mode="left">
                                {Object.keys(groupedAppointments).map(date => (
                                    <Timeline.Item key={date} label={<Text strong>{dayjs(parseThaiDate(date)).format('ddd D MMM')}</Text>}>
                                        {groupedAppointments[date].map(item => (
                                            <Card key={item.id} size="small" hoverable style={{ marginBottom: '8px' }}>
                                                <Row justify="space-between" align="middle">
                                                    <Col><Text>{item.appointmentTime}</Text><Text type="secondary" style={{ marginLeft: '8px' }}>({item.contractNumber})</Text></Col>
                                                    <Col><Link to={`/appointment-details/${item.id}`}><Button size="small">ดูรายละเอียด</Button></Link></Col>
                                                </Row>
                                            </Card>
                                        ))}
                                    </Timeline.Item>
                                ))}
                            </Timeline>
                        ) : (
                            <Text type="secondary">{selectedDate ? `ไม่มีนัดหมายในวันที่ ${selectedDate.format('D MMMM YYYY')}` : 'ไม่มีรายการนัดหมายในช่วงเวลานี้'}</Text>
                        )}
                    </Card>
                </Col>
                <Col xs={24} lg={8}>
                     <Card bordered={false} title="สถานะการลาล่าสุด" style={{ marginBottom: '24px' }}>
                        {employeeLeaveHistory.length > 0 ? (
                            employeeLeaveHistory.map(leaveItem => (
                                <Row key={leaveItem.id} align="middle" gutter={16}>
                                    <Col>{getLeaveStatusIcon(leaveItem.status)}</Col>
                                    <Col>
                                        <Text strong>วันที่ลา: {dayjs(leaveItem.date).format('D MMMM BBBB')}</Text><br/>
                                        <Text>สถานะ: <Tag color={leaveItem.status === 'Approved' ? 'success' : 'warning'}>{leaveItem.status}</Tag></Text>
                                    </Col>
                                </Row>
                            ))
                        ) : (
                            <Text type="secondary">ไม่พบประวัติการลา</Text>
                        )}
                    </Card>
                    <Card bordered={false} title="ปฏิทินภาพรวม">
                         <Calendar 
                            fullscreen={false} 
                            dateCellRender={dateCellRender} 
                            onSelect={handleDateSelect} 
                         />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomePageEm;