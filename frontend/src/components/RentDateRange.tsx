// RentDateRange.tsx
import  { useState } from "react";
import { DatePicker, InputNumber, Button, Space, List } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import "../style/CreateRentCar.css";

const { RangePicker } = DatePicker;

interface RentPeriod {
  id: number;
  start: string;
  end: string;
  price: number;
}

interface Props {
  value?: RentPeriod[];
  onChange?: (value: RentPeriod[]) => void;
}

export default function RentDateRange({ value = [], onChange }: Props) {
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [price, setPrice] = useState<number>(2000);

  const addPeriod = () => {
    if (dates && price) {
      const newPeriod: RentPeriod = {
        id: Date.now(),
        start: dates[0].format("DD/MM/YYYY"),
        end: dates[1].format("DD/MM/YYYY"),
        price,
      };
      const newValue = [...value, newPeriod];
      onChange?.(newValue);
      setDates(null);
    }
  };

  const removePeriod = (id: number) => {
    const newValue = value.filter((p) => p.id !== id);
    onChange?.(newValue);
  };

  return (
    <div className="rent-page-root" style={{ maxWidth: 500 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <RangePicker
          value={dates as RangePickerProps["value"]}
          onChange={(val) => setDates(val as [dayjs.Dayjs, dayjs.Dayjs] | null)}
          format="DD/MM/YYYY"
        />
        <InputNumber
          min={0}
          value={price}
          onChange={(val) => setPrice(val ?? 0)}
          addonAfter="บาท/วัน"
          style={{ width: "100%" }}
        />
        <Button type="dashed" onClick={addPeriod} block>
          + เพิ่มช่วงปล่อยเช่า
        </Button>

        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #d9d9d9",
            borderRadius: 4,
          }}
        >
          <List
            size="small"
            dataSource={value}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={() => removePeriod(item.id)}
                  >ลบ
                  </Button>,
                ]}
              >
                {item.start} - {item.end} :{" "}
                {item.price.toLocaleString()} บาท/วัน
              </List.Item>
            )}
          />
        </div>
      </Space>
    </div>
  );
}