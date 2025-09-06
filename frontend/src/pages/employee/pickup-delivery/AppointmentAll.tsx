import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, Tag, Button, Space, Spin, Empty, DatePicker, ConfigProvider, Input, message, Checkbox } from 'antd';
import type { TableProps } from 'antd';
import { CalendarOutlined, FileTextOutlined, ClearOutlined, FilterOutlined } from '@ant-design/icons';
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

// --- vvvvv --- ส่วนที่เพิ่มและแก้ไข --- vvvvv ---
interface CustomerData {
    id: number;
    FirstName: string;
    LastName: string;
}

interface PickupBooking {
  id: number;
  customerId: number; // เพิ่ม customerId เพื่ออ้างอิง
  contractNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  employee: string | undefined;
  appointmentMethod: string | undefined;
  address?: string;
  province?: string;
  district?: string;
  subdistrict?: string;
  status?: 'กำลังดำเนินการ' | 'ยกเลิก' |'จัดส่งสำเร็จ';
}

interface DisplayBooking extends PickupBooking {
    customerName: string; // เพิ่มชื่อ-สกุล สำหรับแสดงผล
}
// --- ^^^^^ --- จบส่วนที่เพิ่มและแก้ไข --- ^^^^^ ---


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
  const [appointments, setAppointments] = useState<DisplayBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [filterDate, setFilterDate] = useState<Dayjs | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tableFilters, setTableFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchAppointments = () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const storedBookings = localStorage.getItem('pickupBookings');
        const storedCustomers = localStorage.getItem('customerData');
        
        if (storedBookings && storedCustomers) {
          const allBookings: PickupBooking[] = JSON.parse(storedBookings);
          const allCustomers: CustomerData[] = JSON.parse(storedCustomers);

          const customerMap = new Map<number, string>();
          allCustomers.forEach(customer => {
            customerMap.set(customer.id, `${customer.FirstName} ${customer.LastName}`);
          });

          const employeeBookings = allBookings
            .filter(booking => booking.employee === user.name)
            .map(booking => ({
                ...booking,
                customerName: customerMap.get(booking.customerId) || 'ไม่พบชื่อ'
            }));

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
    setTableFilters({});
    message.info('ล้างค่าการกรองทั้งหมดแล้ว');
  };

  const filteredData = appointments.filter(item => {
    const matchesSearchText = searchText === '' ||
      item.contractNumber.toLowerCase().includes(searchText) ||
      item.customerName.toLowerCase().includes(searchText); // ค้นหาจากชื่อ

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
      case 'กำลังดำเนินการ': return 'orange';
      case 'จัดส่งสำเร็จ': return 'green';
      case 'ยกเลิก': return 'red';
      default: return 'default';
    }
  };
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTableChange = (pagination: any, filters: any) => {
    setTableFilters(filters);
  };

  const columns: TableProps<DisplayBooking>['columns'] = [
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
    // --- vvvvv --- เพิ่มคอลัมน์ชื่อ-สกุล --- vvvvv ---
    {
        title: 'ชื่อ-สกุล ลูกค้า',
        dataIndex: 'customerName',
        key: 'customerName',
        sorter: (a, b) => a.customerName.localeCompare(b.customerName),
        render: (text) => (
            <span style={{ color: colors.white }}>{text}</span>
        )
    },
    // --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ ---
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
      },
      filters: [
        { text: 'รับที่เต็นท์', value: 'รับรถที่เต็นท์' },
        { text: 'จัดส่ง', value: 'จัดส่ง' },
      ],
      filteredValue: tableFilters.appointmentMethod || null,
      onFilter: (value, record) => {
        const method = record.appointmentMethod || '';
        if (value === 'จัดส่ง') {
            return !method.includes('รับรถที่เต็นท์');
        }
        return method.includes(value as string);
      },
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}
            options={[
              { label: 'รับที่เต็นท์', value: 'รับรถที่เต็นท์' },
              { label: 'จัดส่ง', value: 'จัดส่ง' },
            ]}
            value={selectedKeys as string[]}
            onChange={(keys) => setSelectedKeys(keys)}
          />
          <Space>
            <Button onClick={() => { if (clearFilters) clearFilters(); confirm({ closeDropdown: true }); }} size="small" style={{ width: 90 }}>รีเซ็ต</Button>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>ตกลง</Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <FilterOutlined style={{ color: filtered ? colors.gold : undefined }} />,
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
      filters: [
        { text: 'กำลังดำเนินการ', value: 'กำลังดำเนินการ' },
        { text: 'ยกเลิก', value: 'ยกเลิก' },
        { text: 'จัดส่งสำเร็จ', value: 'จัดส่งสำเร็จ' },
      ],
      filteredValue: tableFilters.status || null,
      onFilter: (value, record) => record.status?.indexOf(value as string) === 0,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}
            options={[
                { label: 'กำลังดำเนินการ', value: 'กำลังดำเนินการ' },
                { label: 'ยกเลิก', value: 'ยกเลิก' },
                { label: 'จัดส่งสำเร็จ', value: 'จัดส่งสำเร็จ' },
            ]}
            value={selectedKeys as string[]}
            onChange={(keys) => setSelectedKeys(keys)}
          />
          <Space>
            <Button onClick={() => { if (clearFilters) clearFilters(); confirm({ closeDropdown: true }); }} size="small" style={{ width: 90 }}>รีเซ็ต</Button>
            <Button type="primary" onClick={() => confirm()} size="small" style={{ width: 90 }}>ตกลง</Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => <FilterOutlined style={{ color: filtered ? colors.gold : undefined }} />,
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
          Table: { colorBgContainer: colors.gray, headerBg: colors.goldDark, headerColor: colors.black, colorBorderSecondary: colors.gold, rowHoverBg: '#2a2a2a', colorText: colors.white, headerSortActiveBg: colors.gold, headerSortHoverBg: colors.gold, filterDropdownBg: colors.gray },
          Input: { colorBgContainer: colors.black, colorText: colors.white, colorBorder: colors.gold, activeBorderColor: colors.gold, hoverBorderColor: colors.gold, colorTextPlaceholder: '#aaa', controlOutline: 'none', colorIcon: colors.gold, colorIconHover: colors.goldDark },
          DatePicker: { colorBgContainer: colors.black, colorText: colors.white, colorBorder: colors.gold, activeBorderColor: colors.gold, hoverBorderColor: colors.gold, colorTextPlaceholder: '#aaa', controlOutline: `2px solid ${colors.gold}40`, cellHoverBg: colors.goldDark, controlItemBgActive: colors.gold, colorBgElevated: colors.gray, colorTextHeading: colors.white, colorIcon: colors.gold, colorIconHover: colors.goldDark },
          Button: { defaultBg: colors.gray, defaultColor: colors.white, defaultBorderColor: colors.gold, defaultHoverBg: colors.goldDark, defaultHoverColor: colors.black, defaultHoverBorderColor: colors.gold },
          Empty: { colorText: colors.white, colorTextDisabled: '#aaa' },
          Pagination: { colorText: colors.gold, colorTextDisabled: colors.gold },
        },
      }}
    >
      <div style={{ padding: '2rem', background: colors.black, minHeight: '100vh', marginTop: '60px' }}>
        <Title level={2} style={{ color: colors.gold, marginBottom: '2rem', borderBottom: `1px solid ${colors.gold}`, paddingBottom: '1rem' }}>
          รายการนัดหมายของฉัน
        </Title>
        <Space direction="vertical" style={{ marginBottom: '24px', width: '100%' }}>
          <Search
            placeholder="ค้นหาจากเลขที่สัญญา หรือ ชื่อลูกค้า"
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
              format="D MMMM YYYY"
              style={{ minWidth: 220 }}
            />
            <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
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
            locale={{ emptyText: <Empty description={<Typography.Text style={{ color: '#777' }}>
                            {'ไม่มีข้อมูลการนัดหมายที่ตรงกับเงื่อนไข'}</Typography.Text>} />}} 
            onChange={handleTableChange}
          />
        </Spin>
      </div>
    </ConfigProvider>
  );
};

export default AppointmentAll;