import { useState } from "react";
import { DatePicker, InputNumber, Button, Space, List } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs, { Dayjs } from "dayjs";
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
  const [dates, setDates] = useState<[Dayjs, Dayjs] | undefined>(undefined);
  const [price, setPrice] = useState<number>(2000);

  // ✅ ปิดวันก่อน "วันนี้"
  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  const addPeriod = () => {
    if (dates && dates[0] && dates[1] && price > 0) {
      const newPeriod: RentPeriod = {
        id: Date.now(),
        start: dates[0].format("DD/MM/YYYY"),
        end: dates[1].format("DD/MM/YYYY"),
        price,
      };
      const newValue = [...value, newPeriod];
      onChange?.(newValue);
      setDates(undefined); // ✅ รีเซ็ตค่า
    }
  };

  const removePeriod = (id: number) => {
    const newValue = value.filter((p) => p.id !== id);
    onChange?.(newValue);
  };

  return (
    <div
      className="rent-page-root"
      style={{
        maxWidth: 500,
        backgroundColor: "#000",
        padding: "16px",
        borderRadius: 10,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <RangePicker
          value={dates}
          onChange={(val) => setDates(val as [Dayjs, Dayjs] | undefined)}
          format="DD/MM/YYYY"
          disabledDate={disabledDate} // ✅ ผูกตรงนี้
          style={{
            width: "100%",
            backgroundColor: "#1a1a1a",
            border: "2px solid gold",
            color: "white",
            borderRadius: 8,
          }}
          popupClassName="custom-dark-calendar"
        />

        <InputNumber
          min={0}
          value={price}
          onChange={(val) => setPrice(val ?? 0)}
          addonAfter="บาท/วัน"
          style={{
            width: "100%",
            backgroundColor: "#1a1a1a",
            color: "white",
            border: "2px solid gold",
            borderRadius: 8,
          }}
        />

        <Button
          type="dashed"
          onClick={addPeriod}
          block
          style={{
            color: "gold",
            borderColor: "gold",
          }}
        >
          + เพิ่มช่วงปล่อยเช่า
        </Button>

        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid gold",
            borderRadius: 8,
            backgroundColor: "#1a1a1a",
            color: "white",
          }}
        >
          <List
            size="small"
            dataSource={value}
            renderItem={(item) => (
              <List.Item
                style={{ color: "white" }}
                actions={[
                  <Button
                    type="link"
                    danger
                    onClick={() => removePeriod(item.id)}
                  >
                    ลบ
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
