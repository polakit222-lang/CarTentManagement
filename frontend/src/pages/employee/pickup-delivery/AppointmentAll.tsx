import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, Tag, Button, Space, Spin, Empty } from 'antd';
import type { TableProps } from 'antd';
import { CalendarOutlined, FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';

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
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'จัดส่งสำเร็จ';
}

// ## FIX: แก้ไขฟังก์ชันแปลงวันที่ให้ถูกต้องสมบูรณ์ ##
const parseThaiDate = (dateString: string): Date | null => {
    if (!dateString) return null;

    const months: { [key: string]: number } = {
        'มกราคม': 0, 'กุมภาพันธ์': 1, 'มีนาคม': 2, 'เมษายน': 3, 'พฤษภาคม': 4, 'มิถุนายน': 5,
        'กรกฎาคม': 6, 'สิงหาคม': 7, 'กันยายน': 8, 'ตุลาคม': 9, 'พฤศจิกายน': 10, 'ธันวาคม': 11
    };

    const parts = dateString.split(' ');
    if (parts.length !== 3) return null;

    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    let year = parseInt(parts[2], 10);

    const month = months[monthName];

    // ตรวจสอบว่าปีเป็น พ.ศ. หรือไม่ (ถ้ามากกว่า 2500 ให้ถือว่าเป็น พ.ศ.)
    if (year > 2500) {
        year -= 543;
    }

    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
        // สร้าง Date โดยใช้ UTC เพื่อหลีกเลี่ยงปัญหา Timezone
        return new Date(Date.UTC(year, month, day));
    }

    return null;
};


const AppointmentAll: React.FC = () => {
  const [appointments, setAppointments] = useState<PickupBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const storedData = localStorage.getItem('pickupBookings');
        if (storedData) {
          const allBookings: PickupBooking[] = JSON.parse(storedData);
          const employeeBookings = allBookings.filter(
            booking => booking.employee === user.name
          );
          setAppointments(employeeBookings);
        }
      } catch (error) {
        console.error("Failed to parse appointments from localStorage", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleViewDetails = (id: number) => {
    navigate(`/appointment-details/${id}`);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Pending': return 'gold';
      case 'Confirmed': return 'blue';
      case 'Completed': return 'green';
      case 'จัดส่งสำเร็จ': return 'green';
      case 'Cancelled': return 'red';
      default: return 'default';
    }
  };

  const columns: TableProps<PickupBooking>['columns'] = [
    {
      title: 'วันที่และเวลานัดหมาย',
      dataIndex: 'appointmentDate',
      key: 'appointmentDateTime',
      sorter: (a, b) => {
          const dateA = parseThaiDate(a.appointmentDate);
          const dateB = parseThaiDate(b.appointmentDate);
          return (dateA?.getTime() || 0) - (dateB?.getTime() || 0);
      },
      render: (_, record) => {
        const date = parseThaiDate(record.appointmentDate);
        // ## FIX: แสดงผลโดยอ้างอิง Timezone UTC เพื่อความแม่นยำ ##
        const displayDate = date ? date.toLocaleDateString('th-TH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: 'UTC' 
        }) : "รูปแบบวันที่ไม่ถูกต้อง";

        return (
            <span>
              <CalendarOutlined style={{ marginRight: 8, color: '#FFD700' }} />
              {`${displayDate} เวลา: ${record.appointmentTime}`}
            </span>
        );
      },
    },
    {
      title: 'เลขที่สัญญา',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      render: (text) => (
        <span>
          <FileTextOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: 'ประเภท',
      dataIndex: 'appointmentMethod',
      key: 'appointmentMethod',
      render: (method) => {
        const isPickUp = method?.includes('รับรถที่เต็นท์');
        return (
            <Tag color={isPickUp ? 'geekblue' : 'purple'}>
                {isPickUp ? 'รับที่เต็นท์' : 'จัดส่ง'}
            </Tag>
        );
      }
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {(status || 'N/A').toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'จัดการ',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="primary" 
            style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#000' }}
            onClick={() => handleViewDetails(record.id)}
          >
            อัปเดตสถานะ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#33363d', minHeight: '100vh', marginTop: '40px' }}>
      <Title level={2} style={{ color: '#FFD700', marginBottom: '24px' }}>
        รายการนัดหมายของฉัน
      </Title>
      <Spin spinning={loading} size="large">
        <Table
          columns={columns}
          dataSource={appointments}
          rowKey="id"
          style={{ background: '#40444b' }}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          locale={{ emptyText: <Empty description="ไม่พบข้อมูลการนัดหมายสำหรับคุณ" /> }}
        />
      </Spin>
    </div>
  );
};

export default AppointmentAll;