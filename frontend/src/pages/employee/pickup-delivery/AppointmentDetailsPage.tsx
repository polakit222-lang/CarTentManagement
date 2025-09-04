// src/pages/employee/AppointmentDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Col,Typography, Button, message, Descriptions, Tag, Divider, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title } = Typography;

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

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<PickupBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedBookings = localStorage.getItem('pickupBookings');
    if (storedBookings) {
      const allBookings: PickupBooking[] = JSON.parse(storedBookings);
      const foundAppointment = allBookings.find(b => b.id === Number(id));
      if (foundAppointment) {
        setAppointment(foundAppointment);
      }
    }
    setLoading(false);
  }, [id]);

  const handleUpdateStatus = () => {
    const storedBookings = localStorage.getItem('pickupBookings');
    if (storedBookings) {
      let allBookings: PickupBooking[] = JSON.parse(storedBookings);
      
      allBookings = allBookings.map(b => 
        b.id === Number(id) ? { ...b, status: 'จัดส่งสำเร็จ' } : b
      );

      localStorage.setItem('pickupBookings', JSON.stringify(allBookings));
      
      setAppointment(prev => prev ? { ...prev, status: 'จัดส่งสำเร็จ' } : null);

      message.success('อัปเดตสถานะสำเร็จ!');
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  }

  if (!appointment) {
    return <Title level={3} style={{ textAlign: 'center', marginTop: '50px', color: 'black' }}>ไม่พบข้อมูลการนัดหมาย</Title>;
  }

  return (
    <div style={{ padding: '24px', background: '#828385ff', minHeight: '100vh',marginTop:'80px' }}>
      
      <Card 
        title={<Title level={4} style={{ color: '#FFD700', margin: 0 }}>{`รายละเอียดนัดหมาย: ${appointment.contractNumber}`}</Title>} 
        bordered={false}
        style={{ background: 'grey', borderRadius: '8px' }}
      >
        <Descriptions 
          bordered 
          column={1} 
          labelStyle={{ color: 'rgba(0, 0, 0, 0.88)', fontWeight: 'bold' }} 
          contentStyle={{ color: 'rgba(0, 0, 0, 0.88)' }}
        >
          <Descriptions.Item label="หมายเลขสัญญา" style={{background:'grey'}}>{appointment.contractNumber}</Descriptions.Item>
          <Descriptions.Item label="วันที่นัดหมาย"style={{background:'grey'}}>{appointment.appointmentDate}</Descriptions.Item>
          <Descriptions.Item label="เวลา"style={{background:'grey'}}>{appointment.appointmentTime}</Descriptions.Item>
          <Descriptions.Item label="พนักงานดูแล"style={{background:'grey',borderBlock:'black'}}>{appointment.employee}</Descriptions.Item>
          <Descriptions.Item label="วิธีการรับรถ"style={{background:'grey'}}>{appointment.appointmentMethod}</Descriptions.Item>
          {appointment.appointmentMethod === 'จัดส่งรถถึงที่' && (
            <Descriptions.Item label="ที่อยู่จัดส่ง">
              {`${appointment.address || ''} ${appointment.subdistrict || ''} ${appointment.district || ''} ${appointment.province || ''}`}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="สถานะ" style={{background:'grey'}}>
            <Tag style={{background:'#517a49'}} color={appointment.status === 'จัดส่งสำเร็จ' ? 'success' : 'processing'}>
              {appointment.status || 'รอดำเนินการ'}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
        <Divider />
        
        <Button 
          type="primary" 
          onClick={handleUpdateStatus}
          disabled={appointment.status === 'จัดส่งสำเร็จ'}
          style={{ 
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            color: 'black',
            borderColor: 'transparent',
            fontWeight: 'bold'
          }}
        >
          อัปเดตสถานะเป็น "จัดส่งสำเร็จ"
        </Button>
        <Col xs={24} lg={12} style={{ marginTop: '20px' }}>
        <Button 
        type="text" 
        icon={<ArrowLeftOutlined />} 
        onClick={() => navigate('/AppointmentAll')} 
        style={{ marginBottom: '16px',background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            color: 'black',
            borderColor: 'transparent',
            fontWeight: 'bold' }}
      >
        กลับไปหน้าแดชบอร์ด
      </Button>
      </Col>
      </Card>
    </div>
  );
};

export default AppointmentDetailsPage;