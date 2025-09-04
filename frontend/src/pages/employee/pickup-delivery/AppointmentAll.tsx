import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, Tag, Button, Space, Spin, Empty, DatePicker, ConfigProvider, Input, message } from 'antd';
import type { TableProps } from 'antd';
import { CalendarOutlined, FileTextOutlined, ClearOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';

// --- Day.js settings for Thai language and Buddhist Era ---
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import thTH from 'antd/locale/th_TH';
dayjs.extend(buddhistEra);
dayjs.locale('th');
// ------------------------------------

// ✅ 1. Import ไฟล์ CSS ที่สร้างขึ้นใหม่
import './AppointmentAll.css';

import type { Dayjs } from 'dayjs';

const { Title } = Typography;
const { Search } = Input;

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
  status?: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'จัดส่งสำเร็จ';
}

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
  if (year > 2500) {
    year -= 543;
  }
  if (!isNaN(day) && month !== undefined && !isNaN(year)) {
    return new Date(Date.UTC(year, month, day));
  }
  return null;
};

const AppointmentAll: React.FC = () => {
  const [appointments, setAppointments] = useState<PickupBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);

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

  const handleClearFilters = () => {
    setSearchText('');
    setFilterDate(null);
    message.info('ล้างค่าการกรองทั้งหมดแล้ว');
  };

  const filteredData = appointments.filter(item => {
    const matchesSearchText = searchText === '' ||
      item.contractNumber.toLowerCase().includes(searchText);

    let matchesDate = true;
    if (filterDate) {
      const itemDate = parseThaiDate(item.appointmentDate);
      if (itemDate) {
        matchesDate = dayjs(itemDate).isSame(filterDate, 'day');
      } else {
        matchesDate = false;
      }
    }
    return matchesSearchText && matchesDate;
  });

  const handleViewDetails = (id: number) => {
    navigate(`/appointment-details/${id}`);
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'Pending': return 'orange';
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
        const displayDate = date ? date.toLocaleDateString('th-TH-u-ca-buddhist', {
          year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
        }) : "รูปแบบวันที่ไม่ถูกต้อง";
        return (
          <span style={{ color: colors.white }}>
            <CalendarOutlined style={{ marginRight: 8, color: colors.gold }} />
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
        <span style={{ color: colors.white }}>
          <FileTextOutlined style={{ marginRight: 8, color: colors.white }} />
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
            style={{ backgroundColor: colors.gold, borderColor: colors.gold, color: colors.black, fontWeight: 500 }}
            onClick={() => handleViewDetails(record.id)}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = colors.goldDark)}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = colors.gold)}
          >
            อัปเดตสถานะ
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        components: {
          Table: {
            colorBgContainer: colors.gray,
            headerBg: colors.goldDark,
            headerColor: colors.black,
            colorBorderSecondary: colors.gold,
            rowHoverBg: '#2a2a2a',
            colorText: colors.white,
            headerSortActiveBg: colors.gold,
            headerSortHoverBg: colors.gold,
          },
          Input: {
            colorBgContainer: colors.black,
            colorText: colors.white,
            colorBorder: colors.gold,
            activeBorderColor: colors.gold,
            hoverBorderColor: colors.gold,
            colorTextPlaceholder: '#aaa',
            controlOutline: 'none',
            colorIcon: colors.gold,
            colorIconHover: colors.goldDark,
          },
          DatePicker: {
            colorBgContainer: colors.black,
            colorText: colors.white,
            colorBorder: colors.gold,
            activeBorderColor: colors.gold,
            hoverBorderColor: colors.gold,
            colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`,
            cellHoverBg: colors.goldDark,
            controlItemBgActive: colors.gold,
            colorBgElevated: colors.gray,
            colorTextHeading: colors.white,
            colorIcon: colors.gold,
            colorIconHover: colors.goldDark,
          },
          Button: {
            defaultBg: colors.gray,
            defaultColor: colors.white,
            defaultBorderColor: colors.gold,
            defaultHoverBg: colors.goldDark,
            defaultHoverColor: colors.black,
            defaultHoverBorderColor: colors.gold,
          },
          Empty: {
            colorText: colors.white,
            colorTextDisabled: '#aaa',
          },
          Pagination: {
            colorText: colors.gold,          // สีของตัวอักษรและลูกศร
            colorTextDisabled: colors.gold,  // สีของลูกศรเมื่อถูกปิดใช้งาน
            
          },
        },
      }}
    >
      <div style={{ padding: '2rem', background: colors.black, minHeight: '100vh', marginTop: '60px' }}>
        <Title level={2} style={{ color: colors.gold, marginBottom: '2rem', borderBottom: `1px solid ${colors.gold}`, paddingBottom: '1rem' }}>
          รายการนัดหมายของฉัน
        </Title>
        <Space direction="vertical" style={{ marginBottom: '24px', width: '100%' }}>
          <Search
            placeholder="ค้นหาจากเลขที่สัญญา"
            allowClear
            value={searchText}
            onChange={(e) => setSearchText(e.target.value.toLowerCase())}
            style={{ maxWidth: 400 }}
          />
          <Space wrap>
            <DatePicker
              value={filterDate}
              onChange={(date) => setFilterDate(date)}
              placeholder="กรองตามวันที่นัดหมาย"
              format="D MMMM BBBB"
              style={{ minWidth: 220 }}
            />
            <Button
              icon={<ClearOutlined />}
              onClick={handleClearFilters}
            >
              ล้างค่า
            </Button>
          </Space>
        </Space>

        <Spin spinning={loading} size="large">
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10, showSizeChanger: true }}
            locale={{ emptyText: <Empty description="ไม่พบข้อมูลการนัดหมายสำหรับคุณ" /> }}
          />
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default AppointmentAll;