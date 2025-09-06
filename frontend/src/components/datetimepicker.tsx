import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { generateDateOptions } from '../data/data';
import 'dayjs/locale/th';
import buddhistEra from 'dayjs/plugin/buddhistEra';

dayjs.locale('th');
dayjs.extend(buddhistEra);

// --- ขั้นตอนที่ 1: เพิ่ม disabledDate ใน props ---
// เพื่อให้ Component นี้รับฟังก์ชันเงื่อนไขจากข้างนอกได้
interface CustomDatePickerProps {
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs) => void;
  disabledDate?: (current: Dayjs) => boolean;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  selectedDate,
  setSelectedDate,
  disabledDate, // --- ขั้นตอนที่ 2: รับ prop เข้ามาใช้งาน ---
}) => {
  const [weekStartDate, setWeekStartDate] = useState(dayjs());
  const today = dayjs().startOf('day');

  const handlePrevWeek = () => {
    const prevWeekStart = weekStartDate.subtract(7, 'day');
    if (prevWeekStart.endOf('week').isBefore(today)) {
      return;
    }
    setWeekStartDate(prevWeekStart);
  };

  const handleNextWeek = () => {
    setWeekStartDate(weekStartDate.add(7, 'day'));
  };

  const dateOptions = generateDateOptions(7, weekStartDate);

  const isPrevWeekDisabled = weekStartDate.subtract(7, 'day').endOf('week').isBefore(today);

  return (
    <div style={{ background: '#333333', padding: '10px 0', borderRadius: '10px 10px 0 0' }}>
      <Row align="middle" justify="center">
        <Col xs={4} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            style={{
              width: '35px',
              height: '35px',
              borderColor: isPrevWeekDisabled ? '#555' : 'gray',
              background: 'transparent',
              color: isPrevWeekDisabled ? '#888' : 'white',
              borderRadius: '50%',
              border: '1px solid #666666',
              cursor: isPrevWeekDisabled ? 'not-allowed' : 'pointer',
            }}
            icon={<LeftOutlined />}
            onClick={handlePrevWeek}
            disabled={isPrevWeekDisabled}
          />
        </Col>
        <Col xs={16} sm={20}>
          <Row justify="center" gutter={[8, 8]}>
            {dateOptions.map((option, index) => {
              // --- ขั้นตอนที่ 3: ใช้ disabledDate ที่รับมาเพื่อตัดสินใจว่าจะ disable ปุ่มหรือไม่ ---
              const isPastDate = option.date.isBefore(today);
              // ตรวจสอบเงื่อนไขจาก prop ที่ส่งเข้ามา ถ้าไม่มี ให้เป็น false
              const isExternallyDisabled = disabledDate ? disabledDate(option.date) : false;
              // ปุ่มจะถูก disable ถ้าเป็นวันในอดีต หรือเข้าเงื่อนไขจากข้างนอก
              const isDisabled = isPastDate || isExternallyDisabled;

              return (
                <Col key={index} span={3}>
                  <Button
                    disabled={isDisabled}
                    style={{
                      width: '100%',
                      minHeight: '60px',
                      background: selectedDate && selectedDate.isSame(option.date, 'day') ? '#f1d430ff' : 'transparent',
                      color: selectedDate && selectedDate.isSame(option.date, 'day') ? 'black' : isDisabled ? '#888' : 'white',
                      borderColor: selectedDate && selectedDate.isSame(option.date, 'day') ? '#f1d430ff' : isDisabled ? '#555' : '#666666',
                      borderRadius: '6px',
                      whiteSpace: 'normal',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '4px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                    onClick={() => !isDisabled && setSelectedDate(option.date)}
                  >
                    <span>{option.label}</span>
                    <span style={{ fontSize: '12px' }}>{option.date.format('DD MMMM BBBB')}</span>
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col xs={4} sm={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Button
            style={{
              width: '35px',
              height: '35px',
              borderColor: 'gray',
              background: 'transparent',
              color: 'white',
              borderRadius: '50%',
              border: '1px solid #666666'
            }}
            icon={<RightOutlined />}
            onClick={handleNextWeek}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CustomDatePicker;