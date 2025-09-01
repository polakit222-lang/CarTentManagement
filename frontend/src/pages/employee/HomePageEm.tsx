// src/pages/employee/HomePageEm.tsx
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, List, Typography, Tag, Button } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { carSellList } from '../../data/carSellList';
import { carList } from '../../data/carList';
import { Link } from 'react-router-dom';

const { Title, Text } = Typography;

const mockLeaveHistory = [
  { id: 1, employee: 'สมชาย', date: '2024-08-27', status: 'Approved' },
  { id: 2, employee: 'สมศรี', date: '2024-08-28', status: 'Pending' },
  { id: 3, employee: 'John Doe', date: '2024-08-29', status: 'Rejected' },
];

interface PickupBooking {
    id: number;
    contractNumber: string;
    appointmentDate: string;
    appointmentTime: string;
    employee: string | undefined;
    appointmentMethod: string | undefined;
    status?: string;
    address?: string;
    province?: string;
    district?: string;
    subdistrict?: string;
}

const HomePageEm: React.FC = () => {
    const { user } = useAuth();
    const [pickupAppointments, setPickupAppointments] = useState<PickupBooking[]>([]);

    useEffect(() => {
        const storedBookings = localStorage.getItem('pickupBookings');
        if (storedBookings) {
            const allBookings: PickupBooking[] = JSON.parse(storedBookings);
            const employeeBookings = allBookings.filter(
                (booking) => booking.employee === user?.name
            );
            setPickupAppointments(employeeBookings);
        }
    }, [user]);

    const employeeSales = carSellList.filter(sell => sell.SalePerson_ID === user?.id);
    const totalSalesValue = employeeSales.reduce((total, sale) => {
        const car = carList.find(c => c.id === sale.id);
        return total + (car?.price || 0);
    }, 0);

    const employeeLeaveHistory = mockLeaveHistory.find(
        (leave) => leave.employee === user?.name
    );

    return (
        <div style={{ padding: '24px', background: '#f0f2f5' ,  minHeight: '100vh'}}>
            <Title style={{ color: '#FFD700', marginTop: '50px' }} level={2}>แดชบอร์ดพนักงาน</Title>
            <Text>ยินดีต้อนรับ, {user?.name}!</Text>

            <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col xs={24} md={12} lg={8}>
                    <Card style={{ background: '#eee9e9ff' }} title="ยอดขายของคุณ" bordered={false}>
                        <text style={{fontSize: '24px', color: 'black',fontWeight: 'bold'}}>฿{totalSalesValue.toLocaleString()}</text>
                        <br></br><text style={{ color: 'black' ,marginTop:'100px'}}>จำนวนรถที่ขายได้: {employeeSales.length} คัน</text>
                    </Card>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginTop: '24px' }}>
                <Col xs={24} lg={12}>
                    <Card title="รายการนัดรับรถยนต์" bordered={false}>
                        <List
                            itemLayout="horizontal"
                            dataSource={pickupAppointments}
                            renderItem={item => (
                                <List.Item
                                    actions={[
                                        // 👇 เพิ่ม className ที่นี่
                                        <Link to={`/appointment-details/${item.id}`} className="details-link">
                                            <Button style={{background:'#3b3535ff'}} type="link">
                                                ดูรายละเอียดเพิ่มเติม
                                            </Button>
                                        </Link>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={`หมายเลขสัญญา: ${item.contractNumber}`}
                                        description={`วันที่นัด: ${item.appointmentDate} เวลา: ${item.appointmentTime}`}
                                    />
                                    {item.status && <Tag style={{background:'#517a49'}} color="success">{item.status}</Tag>}
                                </List.Item>
                            )}
                            locale={{ emptyText: 'ไม่มีรายการนัดหมาย' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card style={{ color: 'black' }} title="ประวัติการลางานล่าสุด" bordered={false}>
                        {employeeLeaveHistory ? (
                            <div style={{ color: 'black' }}> {/* กำหนดสีดำให้ div ครอบ */}
                                <text style={{ color: 'black' }} >วันที่ลา: {employeeLeaveHistory.date}</text>
                                <text style={{marginLeft:'40px'}} >สถานะ:
                                    <Tag style={{background:'#517a49',marginLeft:'15px'}} color={
                                        employeeLeaveHistory.status === 'Approved' ? 'success' :
                                        employeeLeaveHistory.status === 'Pending' ? 'warning' : 'error'
                                    }>
                                        {employeeLeaveHistory.status}
                                    </Tag>
                                </text>
                            </div>
                        ) : (
                            <p>ไม่พบประวัติการลา</p>
                        )}
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomePageEm;