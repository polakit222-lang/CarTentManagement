// src/pages/employee/AppointmentDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, Button, message, Descriptions, Tag, Divider, Spin, ConfigProvider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

// --- Style Variables from Employeestyle.css ---
const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
};

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
    return (
      <div style={{ background: colors.black, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!appointment) {
    return <Title level={3} style={{ textAlign: 'center', marginTop: '50px', color: colors.white }}>ไม่พบข้อมูลการนัดหมาย</Title>;
  }

  const labelStyle: React.CSSProperties = { color: colors.gold };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            colorBgContainer: colors.gray,
            headerBg: colors.gray,
            colorBorderSecondary: colors.gold,
          },
          Descriptions: {
            colorText: colors.white,
            colorSplit: colors.gold,
          },
          Button: {
            colorPrimary: colors.gold,
            colorPrimaryHover: colors.goldDark,
            colorPrimaryText: colors.black,
            defaultBg: colors.gray,
            defaultColor: colors.white,
            defaultBorderColor: colors.gold,
            defaultHoverBg: colors.goldDark,
            defaultHoverColor: colors.black,
            defaultHoverBorderColor: colors.gold,
          },
          Divider: {
            colorSplit: colors.gold,
          },
          Spin: {
            colorPrimary: colors.gold,
          }
        },
      }}
    >
      <div style={{ padding: '24px', background: colors.black, minHeight: '100vh', marginTop: '60px' }}>
        <Row justify="center">
          <Col xs={24} md={20} lg={16} xl={12}>
            <Card 
              title={<Title level={4} style={{ color: colors.gold, margin: 0 }}>{`รายละเอียดนัดหมาย: ${appointment.contractNumber}`}</Title>} 
              bordered={true}
            >
              <Descriptions bordered column={1}>
                <Descriptions.Item label={<Text style={labelStyle}>หมายเลขสัญญา</Text>}>{appointment.contractNumber}</Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>วันที่นัดหมาย</Text>}>{appointment.appointmentDate}</Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>เวลา</Text>}>{appointment.appointmentTime}</Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>พนักงานดูแล</Text>}>{appointment.employee}</Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>วิธีการรับรถ</Text>}>{appointment.appointmentMethod}</Descriptions.Item>
                {appointment.appointmentMethod === 'จัดส่งรถถึงที่' && (
                  <Descriptions.Item label={<Text style={labelStyle}>ที่อยู่จัดส่ง</Text>}>
                    <Text style={{ color: colors.white }}>
                      {`${appointment.address || ''} ต.${appointment.subdistrict || ''} อ.${appointment.district || ''} จ.${appointment.province || ''}`}
                    </Text>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label={<Text style={labelStyle}>สถานะ</Text>}>
                  <Tag color={appointment.status === 'จัดส่งสำเร็จ' ? 'success' : 'processing'}>
                    {(appointment.status || 'รอดำเนินการ').toUpperCase()}
                  </Tag>
                </Descriptions.Item>
              </Descriptions>
              
              <Divider />
              
              <Row justify="space-between" align="middle">
                <Col>
                  {/* ✅ FIX: ใช้เงื่อนไขเพื่อซ่อนปุ่มเมื่อสถานะเป็น 'จัดส่งสำเร็จ' */}
                  {appointment.status !== 'จัดส่งสำเร็จ' && (
                    <Button 
                      type="primary" 
                      onClick={handleUpdateStatus}
                    >
                      อัปเดตสถานะเป็น "จัดส่งสำเร็จ"
                    </Button>
                  )}
                </Col>
                <Col>
                  <Button 
                    type="default"
                    icon={<ArrowLeftOutlined />} 
                    onClick={() => navigate('/AppointmentAll')} 
                  >
                    กลับ
                  </Button>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </ConfigProvider>
  );
};

export default AppointmentDetailsPage;