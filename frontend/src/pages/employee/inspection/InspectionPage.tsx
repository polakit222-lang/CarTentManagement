import React, { useState, useEffect } from 'react';
// 1. เพิ่ม ConfigProvider ในการ import จาก antd
import { ConfigProvider, Typography, Table, Tag, Space, Button, Input, Select, message, Empty, DatePicker } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import type { TableProps } from 'antd';

// Import dayjs และ plugin ที่จำเป็น
import dayjs from 'dayjs';
import 'dayjs/locale/th'; // **สำคัญมาก: import ภาษาไทยสำหรับ dayjs**
import customParseFormat from 'dayjs/plugin/customParseFormat';
import type { Dayjs } from 'dayjs';
import './InspectionPage.css';

// 2. Import locale ภาษาไทยสำหรับ Ant Design
import th_TH from 'antd/locale/th_TH';

// ตั้งค่าให้ dayjs รู้จักภาษาไทยและรูปแบบวันที่พิเศษ
dayjs.locale('th');
dayjs.extend(customParseFormat);

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

interface InspectionBooking {
  id: number;
  contractNumber: string;
  appointmentDate: string; // Format: "DD MMMM BBBB" e.g., "04 กันยายน 2568"
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

    // *** แก้ไข: ใช้ 'BBBB' ในการ parse วันที่จากข้อมูลที่เก็บไว้
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
        // *** แก้ไข: ใช้ 'BBBB' ในการ parse วันที่เพื่อจัดเรียง
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
        let color = 'geekblue';
        if (status === 'ยกเลิก') color = 'volcano';
        else if (status === 'เสร็จสิ้น') color = 'green';
        else if (status === 'กำลังดำเนินการ') color = 'cyan';
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
          return null;
        }

        let selectClassName = 'status-select-default';
        if (record.status === 'รอตรวจสอบ') {
          selectClassName = 'status-select-pending';
        } else if (record.status === 'กำลังดำเนินการ') {
          selectClassName = 'status-select-processing';
        }

        return (
          <Select
            value={record.status}
            style={{ width: 150 }}
            onChange={(newStatus) => handleStatusChange(record.id, newStatus)}
            dropdownClassName="status-select-dropdown"
            className={`ant-select-custom ${selectClassName}`}
          >
            <Option value="รอตรวจสอบ" className="status-option-pending">รอตรวจสอบ</Option>
            <Option value="กำลังดำเนินการ" className="status-option-processing">กำลังดำเนินการ</Option>
            <Option value="เสร็จสิ้น" className="status-option-completed">เสร็จสิ้น</Option>
            <Option value="ยกเลิก" className="status-option-cancelled">ยกเลิก</Option>
          </Select>
        );
      },
    },
  ];

  return (
    // 3. ใช้ ConfigProvider ครอบ JSX ทั้งหมดเพื่อเปลี่ยนภาษาของ UI ใน Calendar
    <ConfigProvider locale={th_TH}>
      <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh', marginTop: '40px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ color: '#FFD700' }}>รายการนัดตรวจสภาพรถยนต์</Title>

          <Space direction="vertical" style={{ width: '100%' }}>
            <Search
              placeholder="ค้นหาจากเลขที่สัญญา, ชื่อ, หรือสกุล"
              allowClear
              onChange={(e) => setSearchText((e.target.value || '').toLowerCase())}
              onSearch={handleSearch}
              style={{ maxWidth: 500 }}
            />
            {/* ส่วนของ Filter ที่ถูกปรับปรุงแล้ว */}
            <Space style={{ marginTop: 10 }} wrap>
              <DatePicker
                picker="date"
                value={selectedDate}
                onChange={handleDateChange}
                placeholder="เลือกวันที่นัดหมาย"
                format="D MMMM BBBB" // format การแสดงผลในช่อง Input
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
            style={{ background: '#fff', borderRadius: '8px' }}
            loading={isLoading}
            locale={{
              emptyText: <Empty description="ไม่มีข้อมูลการนัดหมายที่ตรงกับเงื่อนไข" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            }}
          />
        </Space>
      </div>
    </ConfigProvider>
  );
};

export default InspectionPage;