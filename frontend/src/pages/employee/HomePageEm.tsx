/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/employee/HomePageEm.tsx
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Typography, Tag, Button, Statistic, Progress, Divider, Timeline, Calendar, Badge, Tooltip, ConfigProvider, Collapse, message } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { CarOutlined, TrophyOutlined, ClockCircleOutlined, CheckCircleOutlined, IssuesCloseOutlined, ClearOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import thTH from 'antd/locale/th_TH';

import './Employeestyle.css';

dayjs.locale('th');
dayjs.extend(buddhistEra);

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// --- Style Variables ---
const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
};

// --- Mockup Data (Sales and Leave only) ---
interface CarSell { id: number; carName: string; price: number; date: string; employee: string; }
const mockCarSellList: CarSell[] = [
    { id: 1, carName: 'Toyota Camry', price: 850000, date: '2025-09-04', employee: 'Somchai' },
    { id: 2, carName: 'Honda Civic', price: 780000, date: '2025-09-03', employee: 'Somsri' },
    { id: 3, carName: 'Ford Ranger', price: 920000, date: '2025-09-01', employee: 'Somchai' },
    { id: 4, carName: 'Isuzu D-Max', price: 890000, date: '2025-08-15', employee: 'Somchai' },
];
const mockLeaveHistory = [
  { id: 1, employee: 'Somchai', date: '2025-09-10', status: 'Approved' },
  { id: 2, employee: 'Somsri', date: '2025-09-12', status: 'Pending' },
];
const SALES_TARGET = 2_000_000;

// --- Interfaces ---
interface PickupBooking { id: number; contractNumber: string; appointmentDate: string; appointmentTime: string; employee: string | undefined; }
// --- vvvvv --- ส่วนที่แก้ไข 1 --- vvvvv ---
interface AuthenticatedUser {
    id: number; // แก้ไขจาก ID เป็น id (ตัวเล็ก)
    firstName?: string;
    lastName?: string;
}
// --- ^^^^^ --- จบส่วนที่แก้ไข 1 --- ^^^^^ ---

// --- Helper Functions ---
const parseThaiDate = (thaiDate: string): Date | null => {
    const months: { [key: string]: number } = { 'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5, 'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11 };
    const parts = thaiDate.split(' ');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0], 10), month = months[parts[1]], year = parseInt(parts[2], 10) - 543;
    if (!isNaN(day) && month !== undefined && !isNaN(year)) return new Date(year, month, day);
    return null;
};


const HomePageEm: React.FC = () => {
    const { user } = useAuth() as { user: AuthenticatedUser | null };
    const [allAppointments, setAllAppointments] = useState<PickupBooking[]>([]);
    const [displayedAppointments, setDisplayedAppointments] = useState<PickupBooking[]>([]);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [employeeLeaveHistory, setEmployeeLeaveHistory] = useState<(typeof mockLeaveHistory)>([]);
    const [salesSummary, setSalesSummary] = useState({ totalSales: 0, carsSold: 0, recentSales: [] as CarSell[] });

    const sortAppointments = (appointments: PickupBooking[]): PickupBooking[] => [...appointments].sort((a, b) => {
        const dateA = parseThaiDate(a.appointmentDate)?.getTime() || 0;
        const dateB = parseThaiDate(b.appointmentDate)?.getTime() || 0;
        if (dateA !== dateB) return dateA - dateB;
        const timeA = parseInt(a.appointmentTime.split(':')[0]);
        const timeB = parseInt(b.appointmentTime.split(':')[0]);
        return timeA - timeB;
    });

    useEffect(() => {
        const fetchAppointments = async () => {
            // --- vvvvv --- ส่วนที่แก้ไข 2 --- vvvvv ---
            if (!user || !user.id) return; // แก้ไขจาก user.ID เป็น user.id

            try {
                // แก้ไขจาก user.ID เป็น user.id
                const response = await fetch(`http://localhost:8080/pickup-deliveries/employee/${user.id}`);
            // --- ^^^^^ --- จบส่วนที่แก้ไข 2 --- ^^^^^ ---

                if (!response.ok) {
                    throw new Error('Failed to fetch appointments');
                }
                const result = await response.json();
                
                const transformedAppointments: PickupBooking[] = result.data.map((item: any) => ({
                    id: item.ID,
                    contractNumber: `SC-${item.SalesContract.ID}`,
                    appointmentDate: dayjs(item.DateTime).format('D MMMM BBBB'),
                    appointmentTime: dayjs(item.DateTime).format('HH:mm'),
                    employee: item.Employee.first_name,
                }));
                
                setAllAppointments(transformedAppointments);

                // ตั้งค่าการแสดงผลเริ่มต้น
                const today = dayjs();
                const startDate = today.subtract(3, 'day').startOf('day');
                const endDate = today.add(3, 'day').endOf('day');
                const initialFiltered = transformedAppointments.filter(b => {
                    const appDate = parseThaiDate(b.appointmentDate);
                    return appDate && dayjs(appDate).isBetween(startDate, endDate, null, '[]');
                });
                setDisplayedAppointments(sortAppointments(initialFiltered));

            } catch (error) {
                console.error('Error fetching appointments:', error);
                message.error('ไม่สามารถโหลดข้อมูลนัดหมายได้');
            }
        };

        const setupMockData = () => {
             if (user) {
                const employeeFirstName = user.firstName;
                if (employeeFirstName) {
                    const currentMonth = new Date().getMonth();
                    const currentYear = new Date().getFullYear();
                    const employeeSales = mockCarSellList.filter(s => {
                        const saleDate = new Date(s.date);
                        return s.employee === employeeFirstName && saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear;
                    });
                    setSalesSummary({
                        totalSales: employeeSales.reduce((sum, s) => sum + s.price, 0),
                        carsSold: employeeSales.length,
                        recentSales: employeeSales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3)
                    });
                    setEmployeeLeaveHistory(mockLeaveHistory.filter(h => h.employee === employeeFirstName));
                }
            }
        };

        fetchAppointments();
        setupMockData();

    }, [user]);
    
    const dateCellRender = (date: Dayjs) => {
        const hasAppointment = allAppointments.some(app => dayjs(parseThaiDate(app.appointmentDate)).isSame(date, 'day'));
        const leaveOnDate = employeeLeaveHistory.find(l => dayjs(l.date).isSame(date, 'day'));
        return (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {hasAppointment && <li><Badge status="processing" color={colors.gold} /></li>}
                {leaveOnDate && <li><Badge status={leaveOnDate.status === 'Approved' ? 'success' : 'warning'} text="วันลา" /></li>}
            </ul>
        );
    };
    const handleDateSelect = (date: Dayjs) => {
        setSelectedDate(date);
        setDisplayedAppointments(sortAppointments(allAppointments.filter(app => dayjs(parseThaiDate(app.appointmentDate)).isSame(date, 'day'))));
    };
    const clearFilter = () => {
        setSelectedDate(null);
        const today = dayjs(), startDate = today.subtract(3, 'day').startOf('day'), endDate = today.add(3, 'day').endOf('day');
        setDisplayedAppointments(sortAppointments(allAppointments.filter(b => {
            const appDate = parseThaiDate(b.appointmentDate);
            return appDate && dayjs(appDate).isBetween(startDate, endDate, null, '[]');
        })));
    };

    const salesProgress = Math.round((salesSummary.totalSales / SALES_TARGET) * 100);
    const getLeaveStatusIcon = (status?: string) => {
        switch (status) {
            case 'Approved': return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />;
            case 'Pending': return <ClockCircleOutlined style={{ color: '#faad14', fontSize: '24px' }} />;
            default: return <IssuesCloseOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />;
        }
    };

    const groupedAppointments = displayedAppointments.reduce((acc, app) => {
        (acc[app.appointmentDate] = acc[app.appointmentDate] || []).push(app);
        return acc;
    }, {} as Record<string, PickupBooking[]>);

    const cardStyle: React.CSSProperties = { backgroundColor: colors.gray, border: `1px solid ${colors.gold}`, height: '100%' };

    return (
        <ConfigProvider
            locale={thTH}
            theme={{
                components: {
                    Button: { defaultBg: colors.gray, defaultColor: colors.white, defaultBorderColor: colors.gold, defaultHoverBg: colors.goldDark, defaultHoverColor: colors.black, defaultHoverBorderColor: colors.gold, colorBgTextHover: colors.goldDark, },
                    Calendar: { colorBgContainer: 'transparent', colorText: colors.white, colorTextHeading: '#ccc', colorBgTextHover: colors.goldDark, controlItemBgActive: colors.gold, },
                    Timeline: { colorPrimary: colors.gold, itemPaddingBottom: 20, },
                    Divider: { colorSplit: colors.gold, },
                    Badge: { colorPrimary: colors.gold, colorText: colors.gold, },
                    Collapse: { colorBgContainer: colors.gray, colorText: colors.white, colorTextHeading: colors.gold, headerBg: colors.gray, colorBorder: colors.gold, contentBg: colors.gray, },
                    Progress: { colorText: colors.gold, }
                }
            }}
        >
            <div style={{ padding: '2rem', background: colors.black, color: colors.white, minHeight: '100vh' }}>
                <Title level={2} style={{ color: colors.gold, marginBottom: '24px', marginTop: '60px' }}>
                    Welcome, {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : 'Employee'}
                </Title>
                
                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card bordered={false} style={cardStyle}>
                            <Row align="middle" gutter={24}>
                                <Col xs={24} md={12}>
                                    <Title level={4} style={{ color: colors.gold }}>สรุปยอดขายเดือนนี้</Title>
                                    <Paragraph style={{ color: '#ccc' }}>อัปเดตล่าสุด: {dayjs().format('D MMMM BBBB')}</Paragraph>
                                    <Statistic title={<span style={{color: colors.white}}>ยอดขายรวม</span>} value={salesSummary.totalSales} precision={0} prefix="฿" valueStyle={{ color: colors.gold, fontSize: '2.5rem' }} />
                                    <Statistic title={<span style={{color: colors.white}}>จำนวนรถที่ขายได้</span>} value={salesSummary.carsSold} prefix={<CarOutlined />} valueStyle={{ color: colors.gold }} suffix="คัน" />
                                </Col>
                                <Col xs={24} md={12} style={{ textAlign: 'center' }}>
                                    <Progress type="dashboard" percent={salesProgress} format={(p) => `${p}%`} strokeColor={{ '0%': colors.goldDark, '100%': colors.gold }} width={180} />
                                    <Title level={5} style={{ marginTop: '16px', color: colors.white }}>เป้าหมายยอดขาย</Title>
                                    <Text style={{ color: '#ccc' }}>{new Intl.NumberFormat('th-TH').format(SALES_TARGET)} บาท</Text>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Card bordered={false} title={<span style={{color: colors.gold}}><TrophyOutlined /> รายการขายล่าสุด</span>} style={cardStyle}>
                            <List
                                itemLayout="horizontal"
                                dataSource={salesSummary.recentSales}
                                renderItem={item => (
                                    <List.Item style={{ borderBottomColor: colors.goldDark }}>
                                        <List.Item.Meta title={<Text style={{color: colors.white}}>{item.carName}</Text>} description={<span style={{color: '#aaa'}}>{`ราคา: ${item.price.toLocaleString()} บาท`}</span>} />
                                        <Text style={{color: '#ccc'}}>{dayjs(item.date).format('D MMM')}</Text>
                                    </List.Item>
                                )}
                                locale={{ emptyText: <span style={{color: '#aaa'}}>ยังไม่มีรายการขายในเดือนนี้</span> }}
                            />
                        </Card>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[24, 24]}>
                    <Col xs={24} lg={16}>
                        <Card 
                            bordered={false} 
                            title={<span style={{color: colors.gold}}>ตารางนัดหมาย</span>}
                            style={cardStyle}
                            extra={selectedDate && (
                                <Tooltip title="ล้างตัวกรอง"><Button type="text" icon={<ClearOutlined />} onClick={clearFilter}><span style={{color: colors.white}}>แสดงช่วงเวลาปกติ</span></Button></Tooltip>
                            )}
                        >
                            {displayedAppointments.length > 0 ? (
                                <Timeline mode="left">
                                    {Object.keys(groupedAppointments).map(date => (
                                        <Timeline.Item key={date} label={<Text style={{color: '#ccc'}}>{dayjs(parseThaiDate(date)).format('ddd D MMM YYYY')}</Text>}>
                                            {groupedAppointments[date].map(item => (
                                                <Card key={item.id} size="small" hoverable style={{ marginBottom: '8px', backgroundColor: colors.black, borderColor: colors.gold }}>
                                                    <Row justify="space-between" align="middle">
                                                        <Col><Text style={{color: colors.white}}>{item.appointmentTime}</Text><Text style={{ marginLeft: '8px', color: '#aaa' }}>({item.contractNumber})</Text></Col>
                                                        <Col><Link to={`/appointment-details/${item.id}`}><Button size="small">ดูรายละเอียด</Button></Link></Col>
                                                    </Row>
                                                </Card>
                                            ))}
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            ) : (
                                <Text style={{color: '#ccc'}}>{selectedDate ? `ไม่มีนัดหมายในวันที่ ${selectedDate.format('D MMMM BBBB')}` : 'ไม่มีรายการนัดหมายในช่วงเวลานี้'}</Text>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} lg={8}>
                        <Collapse accordion defaultActiveKey={['1']} style={{ border: `1px solid ${colors.gold}` }}>
                            <Panel header="สถานะการลาล่าสุด" key="1">
                                {employeeLeaveHistory.length > 0 ? (
                                    employeeLeaveHistory.map(leaveItem => (
                                        <Row key={leaveItem.id} align="middle" gutter={16} style={{ marginBottom: '1rem' }}>
                                            <Col>{getLeaveStatusIcon(leaveItem.status)}</Col>
                                            <Col>
                                                <Text style={{color: colors.white}}>วันที่ลา: {dayjs(leaveItem.date).format('D MMMM BBBB')}</Text><br/>
                                                <Text style={{color: colors.white}}>สถานะ: <Tag color={leaveItem.status === 'Approved' ? 'success' : 'warning'}>{leaveItem.status}</Tag></Text>
                                            </Col>
                                        </Row>
                                    ))
                                ) : (
                                    <Text style={{color: '#ccc'}}>ไม่พบประวัติการลา</Text>
                                )}
                            </Panel>
                            <Panel header="ปฏิทินภาพรวม" key="2">
                                <Calendar 
                                    fullscreen={false} 
                                    dateCellRender={dateCellRender} 
                                    onSelect={handleDateSelect} 
                                />
                            </Panel>
                        </Collapse>
                    </Col>
                </Row>
            </div>
        </ConfigProvider>
    );
};

export default HomePageEm;