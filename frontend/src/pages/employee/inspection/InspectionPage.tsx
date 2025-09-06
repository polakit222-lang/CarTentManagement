import React, { useState, useEffect, useMemo } from 'react';
import { ConfigProvider, Typography, Table, Tag, Space, Button, Input, Select, message, Empty, DatePicker } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
import th_TH from 'antd/locale/th_TH';

import './InspectionPage.css';

dayjs.locale('th');
dayjs.extend(customParseFormat);

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
};

interface CustomerData {
  id: number;
  FirstName: string;
  LastName: string;
}

interface InspectionBooking {
  id: number;
  contractNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  system: string;
  CustomerDataId: number;
  message?: string;
  status: 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก';
}

interface DisplayBooking extends InspectionBooking {
  customerName: string;
}

const InspectionPage: React.FC = () => {
  const [allBookings, setAllBookings] = useState<DisplayBooking[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bookingsData = localStorage.getItem('inspectionBookings');
    const customersData = localStorage.getItem('customerData');

    if (bookingsData && customersData) {
      const bookings: InspectionBooking[] = JSON.parse(bookingsData);
      const customers: CustomerData[] = JSON.parse(customersData);

      const customerMap = new Map<number, string>();
      customers.forEach(customer => {
        customerMap.set(customer.id, `${customer.FirstName} ${customer.LastName}`);
      });

      const combinedData = bookings.map(booking => ({
        ...booking,
        customerName: customerMap.get(booking.CustomerDataId) || 'ไม่พบชื่อลูกค้า',
      }));

      setAllBookings(combinedData);
    }
    setIsLoading(false);
  }, []);
  
  const handleStatusChange = (id: number, newStatus: InspectionBooking['status']) => {
    const updatedData = allBookings.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setAllBookings(updatedData);
    
    const allStoredBookings = JSON.parse(localStorage.getItem('inspectionBookings') || '[]');
    const globallyUpdatedBookings = allStoredBookings.map((item: InspectionBooking) => 
        item.id === id ? { ...item, status: newStatus } : item
    );
    localStorage.setItem('inspectionBookings', JSON.stringify(globallyUpdatedBookings));

    message.success(`อัปเดตสถานะของสัญญา #${id} เป็น "${newStatus}" เรียบร้อย`);
  };

  const handleSearch = (value: string) => {
    setSearchText(value.toLowerCase());
  };

  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSelectedDate(null);
  };

  const filteredData = useMemo(() => {
    return allBookings.filter(item => {
      const matchesSearch =
        item.contractNumber.toLowerCase().includes(searchText) ||
        item.customerName.toLowerCase().includes(searchText);

      const matchesDate =
        !selectedDate || dayjs(item.appointmentDate, 'DD MMMM YYYY').isSame(selectedDate, 'day');
      
      return matchesSearch && matchesDate;
    });
  }, [allBookings, searchText, selectedDate]);

  const getStatusColor = (status: string) => {
    if (status === 'เสร็จสิ้น') return 'green';
    if (status === 'ยกเลิก') return 'red';
    return 'gold';
  };

  const columns: TableProps<DisplayBooking>['columns'] = [
    { title: 'เลขที่สัญญา', dataIndex: 'contractNumber', key: 'contractNumber', sorter: (a, b) => a.contractNumber.localeCompare(b.contractNumber) },
    { title: 'ชื่อ-สกุล ลูกค้า', dataIndex: 'customerName', key: 'customerName', sorter: (a, b) => a.customerName.localeCompare(b.customerName) },
    { title: 'วันที่นัดหมาย', dataIndex: 'appointmentDate', key: 'appointmentDate', sorter: (a, b) => dayjs(a.appointmentDate, 'DD MMMM YYYY').unix() - dayjs(b.appointmentDate, 'DD MMMM YYYY').unix() },
    { title: 'เวลานัดหมาย', dataIndex: 'appointmentTime', key: 'appointmentTime' },
    { title: 'รายการตรวจ', dataIndex: 'system', key: 'system' },
    {
      title: 'สถานะ', key: 'status', dataIndex: 'status',
      render: (status) => <Tag color={getStatusColor(status)} key={status}>{status.toUpperCase()}</Tag>,
      filters: [
        { text: 'กำลังดำเนินการ', value: 'กำลังดำเนินการ' },
        { text: 'เสร็จสิ้น', value: 'เสร็จสิ้น' },
        { text: 'ยกเลิก', value: 'ยกเลิก' },
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    // --- vvvvv --- แก้ไขคอลัมน์ "การจัดการ" --- vvvvv ---
    {
      title: 'การจัดการ',
      key: 'action',
      render: (_, record) => {
        // ถ้าสถานะเสร็จสิ้นหรือยกเลิกแล้ว จะไม่แสดง Dropdown
        if (record.status === 'เสร็จสิ้น' || record.status === 'ยกเลิก') {
          return <span style={{ color: '#aaa' }}>-</span>;
        }
        
        return (
            <Select
              value={record.status}
              style={{ width: 150 }}
              onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
              // เพิ่ม className เพื่อให้ CSS ทำงาน
              className="status-select-custom"
              dropdownClassName="status-select-dropdown"
            >
              <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
              <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
            </Select>
        );
      },
    },
    // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---
  ];

  return (
    <ConfigProvider locale={th_TH} theme={{
      components: {
        Table: {
            colorBgContainer: colors.gray, headerBg: colors.goldDark, headerColor: colors.black,
            colorBorderSecondary: colors.gold, rowHoverBg: '#2a2a2a', colorText: colors.white,
            headerSortActiveBg: colors.gold, headerSortHoverBg: colors.gold, filterDropdownBg: colors.gray,
        },
        Input: {
            colorBgContainer: colors.black, colorText: colors.white, colorBorder: colors.gold,
            activeBorderColor: colors.gold, hoverBorderColor: colors.gold, colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`, colorIcon: colors.gold, colorIconHover: colors.goldDark,
        },
        DatePicker: {
            colorBgContainer: colors.black, colorText: colors.white, colorBorder: colors.gold,
            activeBorderColor: colors.gold, hoverBorderColor: colors.gold, colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`, cellHoverBg: colors.goldDark,
            controlItemBgActive: colors.gold, colorBgElevated: colors.gray, colorTextHeading: colors.white,
            colorIcon: colors.gold, colorIconHover: colors.goldDark,
        },
        Button: {
            defaultBg: colors.gray, defaultColor: colors.white, defaultBorderColor: colors.gold,
            defaultHoverBg: colors.goldDark, defaultHoverColor: colors.black, defaultHoverBorderColor: colors.gold,
        },
        Empty: { colorText: colors.white, colorTextDisabled: '#aaa' },
        Select: {
            colorBgContainer: colors.black, colorText: colors.white, colorBorder: colors.gold,
            activeBorderColor: colors.gold, hoverBorderColor: colors.gold, colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`, optionSelectedBg: colors.gold,
            optionSelectedColor: colors.black, colorBgElevated: colors.gray,
        },
        Pagination: { colorText: colors.gold, colorTextDisabled: colors.goldDark },
      },
    }}>
      <div style={{ padding: '2rem', background: colors.black, minHeight: '100vh', color: colors.white }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ color: colors.gold, borderBottom: `1px solid ${colors.gold}`, paddingBottom: '1rem' }}>
            รายการนัดตรวจสภาพรถยนต์
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="ค้นหาจากเลขที่สัญญา หรือ ชื่อ-สกุลลูกค้า"
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              style={{ maxWidth: 500 }}
            />
            <Space style={{ marginTop: 10 }} wrap>
              <DatePicker
                picker="date"
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="เลือกวันที่นัดหมาย"
                format="D MMMM YYYY"
                style={{ minWidth: 200, flex: 1 }}
              />
              <Button icon={<ClearOutlined />} onClick={handleClearFilters}>
                ล้างค่า
              </Button>
            </Space>
          </Space>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            bordered
            loading={isLoading}
            locale={{
               emptyText: <Empty description={<Typography.Text style={{ color: '#777' }}>{'ไม่มีข้อมูลการนัดหมาย'}</Typography.Text>} />
            }}
          />
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default InspectionPage;