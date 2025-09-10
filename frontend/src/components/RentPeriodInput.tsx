import React from 'react';
import { DatePicker, InputNumber, Button, Space } from 'antd';
import dayjs, { Dayjs } from 'dayjs'; // <-- ใช้ dayjs เป็น value
import type { RentPeriod } from '../services/rentService'; // <-- type จาก service

const { RangePicker } = DatePicker;

interface RentPeriodInputProps {
  periods: RentPeriod[];
  setPeriods: (periods: RentPeriod[]) => void;
}

const RentPeriodInput: React.FC<RentPeriodInputProps> = ({ periods, setPeriods }) => {

  const handleChange = (dates: [Dayjs, Dayjs] | null, index: number) => {
    if (!dates) return;

    const newPeriods = [...periods];
    newPeriods[index] = {
      ...newPeriods[index],
      start_date: dates[0].format('YYYY-MM-DD'),
      end_date: dates[1].format('YYYY-MM-DD')
    };
    setPeriods(newPeriods);
  };

  const handlePriceChange = (value: number | null, index: number) => {
    const newPeriods = [...periods];
    newPeriods[index] = {
      ...newPeriods[index],
      price: value || 0
    };
    setPeriods(newPeriods);
  };

  const addPeriod = () => {
    setPeriods([...periods, { start_date: '', end_date: '', price: 0 }]);
  };

  const removePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    setPeriods(newPeriods);
  };

  return (
    <div>
      {periods.map((p, index) => (
        <Space key={index} style={{ marginBottom: 8 }}>
          <RangePicker
            value={p.start_date && p.end_date ? [dayjs(p.start_date), dayjs(p.end_date)] : null}
            onChange={(dates) => handleChange(dates as [Dayjs, Dayjs], index)}
          />
          <InputNumber
            min={0}
            value={p.price}
            onChange={(value) => handlePriceChange(value, index)}
          />
          <Button onClick={() => removePeriod(index)} danger>Remove</Button>
        </Space>
      ))}
      <Button onClick={addPeriod}>Add Period</Button>
    </div>
  );
};

export default RentPeriodInput;
