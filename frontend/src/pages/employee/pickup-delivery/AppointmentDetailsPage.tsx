import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Col, Row, Typography, Button, message, Descriptions, Tag, Divider, Spin, ConfigProvider } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';

import './AppointmentAll.css';

const { Title, Text } = Typography;

const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
};

interface PickupBooking {
  id: number;
  customerId: number;
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

interface CustomerData {
  id: number;
  FirstName: string;
  LastName: string;
}

const AppointmentDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState<PickupBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState<string>('');

  useEffect(() => {
    const storedBookings = localStorage.getItem('pickupBookings');
    const storedCustomers = localStorage.getItem('customerData');

    if (storedBookings && id) {
      const allBookings: PickupBooking[] = JSON.parse(storedBookings);
      const bookingDetails = allBookings.find(b => b.id === parseInt(id));

      if (bookingDetails) {
        setAppointment(bookingDetails);

        if (storedCustomers) {
          const allCustomers: CustomerData[] = JSON.parse(storedCustomers);
          const customer = allCustomers.find(c => c.id === bookingDetails.customerId);
          if (customer) {
            setCustomerName(`${customer.FirstName} ${customer.LastName}`);
          } else {
            setCustomerName('ไม่พบข้อมูลลูกค้า');
          }
        }

      } else {
        message.error('ไม่พบข้อมูลการนัดหมาย');
        navigate('/AppointmentAll');
      }
    }
    setLoading(false);
  }, [id, navigate]);

  const handleUpdateStatus = () => {
    if (appointment) {
      const storedBookings = localStorage.getItem('pickupBookings');
      if (storedBookings) {
        let allBookings: PickupBooking[] = JSON.parse(storedBookings);
        allBookings = allBookings.map(b =>
          b.id === appointment.id ? { ...b, status: 'จัดส่งสำเร็จ' } : b
        );
        localStorage.setItem('pickupBookings', JSON.stringify(allBookings));
        setAppointment(prev => prev ? { ...prev, status: 'จัดส่งสำเร็จ' } : null);
        message.success('อัปเดตสถานะเป็น "จัดส่งสำเร็จ" เรียบร้อยแล้ว');
      }
    }
  };

  if (loading) {
    return <Spin size="large" style={{ display: 'block', marginTop: '50px' }} />;
  }

  if (!appointment) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <Title level={3} style={{ color: 'white' }}>ไม่พบข้อมูลการนัดหมาย</Title>
        <Button onClick={() => navigate('/AppointmentAll')}>กลับไปหน้ารายการ</Button>
      </div>
    );
  }

  const labelStyle: React.CSSProperties = { color: colors.gold, fontWeight: 'bold' };
  const contentStyle: React.CSSProperties = { color: colors.white };

  return (
    // --- vvvvv --- แก้ไข Theme Tokens ให้ถูกต้อง --- vvvvv ---
    <ConfigProvider theme={{
      components: {
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
        Card: {
          colorBgContainer: colors.gray,
          headerBg: colors.gray,
          colorBorderSecondary: colors.gold,
        },
        Divider: {
          colorSplit: colors.gold,
        },
        Spin: {
          colorPrimary: colors.gold,
        }
      },
    }}>
      <div style={{ padding: '2rem', background: colors.black, minHeight: '100vh', marginTop: '60px' }}>
        <Row justify="center">
          <Col xs={24} md={18} lg={12}>
            <Card>
              <Title style={{ color: colors.gold }} level={3}>
                รายละเอียดการนัดหมาย #{appointment.id}
              </Title>
              <Descriptions bordered column={1} size="middle">
                <Descriptions.Item label={<Text style={labelStyle}>ชื่อ-สกุล ลูกค้า</Text>}>
                  <Text style={contentStyle}>{customerName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>เลขที่สัญญา</Text>}>
                  <Text style={contentStyle}>{appointment.contractNumber}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>วันที่นัดหมาย</Text>}>
                  <Text style={contentStyle}>{appointment.appointmentDate}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>เวลา</Text>}>
                  <Text style={contentStyle}>{appointment.appointmentTime}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>พนักงาน</Text>}>
                  <Text style={contentStyle}>{appointment.employee}</Text>
                </Descriptions.Item>
                <Descriptions.Item label={<Text style={labelStyle}>ประเภท</Text>}>
                  <Text style={contentStyle}>{appointment.appointmentMethod}</Text>
                </Descriptions.Item>
                {appointment.appointmentMethod?.includes('จัดส่ง') && (
                  <Descriptions.Item label={<Text style={labelStyle}>ที่อยู่</Text>}>
                    <Text style={contentStyle}>
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
                  {(appointment.status !== 'จัดส่งสำเร็จ' && appointment.status !== 'ยกเลิก') && (
                    <Button
                      type="primary"
                      onClick={handleUpdateStatus}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.goldDark)}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.gold)}
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
    // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---
  );
};

export default AppointmentDetailsPage;