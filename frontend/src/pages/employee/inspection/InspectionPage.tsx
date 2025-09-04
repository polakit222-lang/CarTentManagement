import React, { useState, useEffect } from 'react';
import { ConfigProvider, Typography, Table, Tag, Space, Button, Input, Select, message, Empty, DatePicker } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
import th_TH from 'antd/locale/th_TH';

// Import the CSS file
import './InspectionPage.css';

dayjs.locale('th');
dayjs.extend(customParseFormat);

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

// --- Style Variables from Employeestyle.css ---
const colors = {
  gold: '#d4af37',
  goldDark: '#b38e2f',
  black: '#121212',
  white: '#ffffff',
  gray: '#1e1e1e',
};

interface InspectionBooking {
  id: number;
  contractNumber: string;
  appointmentDate: string;
  appointmentTime: string;
  system: string;
  firstName?: string;
  lastName?: string;
  message?: string;
  status: 'รอตรวจสอบ' | 'กำลังดำเนินการ' | 'เสร็จสิ้น' | 'ยกเลิก';
}

const InspectionPage: React.FC = () => {
  const [inspectionData, setInspectionData] = useState<InspectionBooking[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('inspectionBookings');
      if (storedData && storedData !== '[]') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedData: InspectionBooking[] = JSON.parse(storedData).map((item: any) => ({
          ...item,
          status: item.status || 'รอตรวจสอบ'
        }));
        setInspectionData(parsedData);
      } else {
        setInspectionData([]);
      }
    } catch (error) {
      console.error("Failed to parse inspection bookings from localStorage", error);
      setInspectionData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleStatusChange = (id: number, newStatus: InspectionBooking['status']) => {
    const updatedData = inspectionData.map(item =>
      item.id === id ? { ...item, status: newStatus } : item
    );
    setInspectionData(updatedData);
    localStorage.setItem('inspectionBookings', JSON.stringify(updatedData));
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
    message.info('ล้างค่าการกรองทั้งหมดแล้ว');
  };

  const filteredData = inspectionData.filter(item => {
     const matchesSearchText = searchText === '' || (
      (item.firstName && item.firstName.toLowerCase().includes(searchText)) ||
      (item.lastName && item.lastName.toLowerCase().includes(searchText)) ||
      item.contractNumber.toLowerCase().includes(searchText)
    );

    if (!selectedDate) {
      return matchesSearchText;
    }

    // Ensure the date parsing format matches the stored data format
    const itemDate = dayjs(item.appointmentDate, 'D MMMM BBBB', 'th');
    const matchesDate = itemDate.isSame(selectedDate, 'day');

    return matchesSearchText && matchesDate;
  });

  const columns: TableProps<InspectionBooking>['columns'] = [
    {
      title: 'เลขที่สัญญา',
      dataIndex: 'contractNumber',
      key: 'contractNumber',
      sorter: (a, b) => a.contractNumber.localeCompare(b.contractNumber),
    },
    {
      title: 'ชื่อ-สกุล ลูกค้า',
      key: 'customerName',
      render: (_, record) => `${record.firstName || ''} ${record.lastName || ''}`,
      sorter: (a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`),
    },
    {
      title: 'ระบบ',
      dataIndex: 'system',
      key: 'system',
    },
    {
      title: 'วันและเวลานัดหมาย',
      key: 'appointmentDateTime',
      render: (_, record) => `${record.appointmentDate} ${record.appointmentTime}`,
      sorter: (a, b) => {
        const startTimeA = a.appointmentTime.split(' ')[0];
        const startTimeB = b.appointmentTime.split(' ')[0];
        const dateA = dayjs(`${a.appointmentDate} ${startTimeA}`, 'D MMMM BBBB HH:mm', 'th');
        const dateB = dayjs(`${b.appointmentDate} ${startTimeB}`, 'D MMMM BBBB HH:mm', 'th');
        return dateA.valueOf() - dateB.valueOf();
      },
    },
    {
      title: 'สถานะ',
      key: 'status',
      dataIndex: 'status',
      render: (status: InspectionBooking['status']) => {
        let color = 'orange'; // Pending
        if (status === 'ยกเลิก') color = 'red';
        else if (status === 'เสร็จสิ้น') color = 'green';
        else if (status === 'กำลังดำเนินการ') color = 'blue';
        return <Tag color={color} key={status}>{status.toUpperCase()}</Tag>;
      },
      filters: [
        { text: 'รอตรวจสอบ', value: 'รอตรวจสอบ' },
        { text: 'กำลังดำเนินการ', value: 'กำลังดำเนินการ' },
        { text: 'เสร็จสิ้น', value: 'เสร็จสิ้น' },
        { text: 'ยกเลิก', value: 'ยกเลิก' },
      ],
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },
    {
      title: 'อัปเดตสถานะ',
      key: 'action',
      render: (_, record) => {
        if (record.status === 'เสร็จสิ้น' || record.status === 'ยกเลิก') {
          return <span style={{ color: '#aaa' }}>-</span>;
        }

        return (
          <Select
            value={record.status}
            style={{ width: 150 }}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            dropdownClassName="status-select-dropdown"
            className="status-select-custom"
          >
            <Option value="รอตรวจสอบ">รอตรวจสอบ</Option>
            <Option value="กำลังดำเนินการ">กำลังดำเนินการ</Option>
            <Option value="เสร็จสิ้น">เสร็จสิ้น</Option>
            <Option value="ยกเลิก">ยกเลิก</Option>
          </Select>
        );
      },
    },
  ];

  return (
    <ConfigProvider
      locale={th_TH}
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
            filterDropdownBg: colors.gray,
          },
          Input: {
            colorBgContainer: colors.black,
            colorText: colors.white,
            colorBorder: colors.gold,
            activeBorderColor: colors.gold,
            hoverBorderColor: colors.gold,
            colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`,
            // เพิ่มสีไอคอนสำหรับ Input (Search Icon)
            colorIcon: colors.gold, // สีไอคอนเริ่มต้น
            colorIconHover: colors.goldDark, // สีไอคอนเมื่อโฮเวอร์
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
            // เพิ่มสีไอคอนสำหรับ DatePicker (ปฏิทิน, ปุ่มเลื่อนเดือน/ปี)
            colorIcon: colors.gold, // สีไอคอนเริ่มต้น
            colorIconHover: colors.goldDark, // สีไอคอนเมื่อโฮเวอร์
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
          Select: {
            colorBgContainer: colors.black,
            colorText: colors.white,
            colorBorder: colors.gold,
            activeBorderColor: colors.gold,
            hoverBorderColor: colors.gold,
            colorTextPlaceholder: '#aaa',
            controlOutline: `2px solid ${colors.gold}40`,
            optionSelectedBg: colors.gold,
            optionSelectedColor: colors.black,
            colorBgElevated: colors.gray,
          },
          Pagination: {
            colorText: colors.gold,          // สีของตัวอักษรและลูกศร
            colorTextDisabled: colors.gold,  // สีของลูกศรเมื่อถูกปิดใช้งาน
            
          },
        },
      }}
    >
      <div style={{ padding: '2rem', background: colors.black, minHeight: '100vh', marginTop: '60px', color: colors.white }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ color: colors.gold, borderBottom: `1px solid ${colors.gold}`, paddingBottom: '1rem' }}>
            รายการนัดตรวจสภาพรถยนต์
          </Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="ค้นหาจากเลขที่สัญญา, ชื่อ, หรือสกุล"
              allowClear
              onChange={(e) => setSearchText((e.target.value || '').toLowerCase())}
              onSearch={handleSearch}
              style={{ maxWidth: 500 }}
            />
            <Space style={{ marginTop: 10 }} wrap>
              <DatePicker
                picker="date"
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="เลือกวันที่นัดหมาย"
                format="D MMMM BBBB"
                style={{ minWidth: 200, flex: 1 }}
              />
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearFilters}
              >
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
              emptyText: <Empty description="ไม่มีข้อมูลการนัดหมายที่ตรงกับเงื่อนไข" />
            }}
          />
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default InspectionPage;