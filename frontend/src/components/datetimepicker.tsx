// src/components/datetimepicker.tsx
import React, { useState } from 'react';
import { Button, Row, Col } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import dayjs, { Dayjs } from 'dayjs';
import { generateDateOptions } from '../data/data';
import 'dayjs/locale/th'; // Ensure Thai locale is loaded
import buddhistEra from 'dayjs/plugin/buddhistEra'; // Import plugin for Buddhist Era

dayjs.locale('th'); // Set locale to Thai
dayjs.extend(buddhistEra); // Extend dayjs with Buddhist Era plugin

interface CustomDatePickerProps {
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ selectedDate, setSelectedDate }) => {
  const [weekStartDate, setWeekStartDate] = useState(dayjs());

  const handlePrevWeek = () => {
    setWeekStartDate(weekStartDate.subtract(7, 'day'));
  };

  const handleNextWeek = () => {
    setWeekStartDate(weekStartDate.add(7, 'day'));
  };

  const dateOptions = generateDateOptions(7, weekStartDate);

  return (
    <div style={{ background: '#333333', padding: '10px 0', borderRadius: '10px 10px 0 0' }}>
      <Row gutter={[8, 8]} justify="center" align="middle" style={{ width: '100%' }}>
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
            icon={<LeftOutlined />}
            onClick={handlePrevWeek}
          />
        </Col>
        <Col xs={16} sm={20} style={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', justifyContent: 'center' }}>
          <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap' }}>
            {dateOptions.map((option, index) => (
              <Col key={index} flex="1" style={{ textAlign: 'center', minWidth: '100px' }}> {/* Adjusted minWidth */}
              <Button
                style={{
                width: '100%',
                height: '70px',
                background: selectedDate && selectedDate.isSame(option.date, 'day') ? '#362e2eff' : '#4a4a4a',
                color: selectedDate && selectedDate.isSame(option.date, 'day') ? '#d1ab00ff' : 'white',
                borderColor: selectedDate && selectedDate.isSame(option.date, 'day') ? '#d1ab00ff' : '#666666',
                borderRadius: '6px',
                whiteSpace: 'normal',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                padding: '4px'
                }}
                onClick={() => setSelectedDate(option.date)}
              >
                <span>{option.label}</span>
                {/* Updated format to include Buddhist year */}
                <span style={{ fontSize: '12px' }}>{option.date.format('DD MMMM BBBB')}</span>
              </Button>
              </Col>
            ))}
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