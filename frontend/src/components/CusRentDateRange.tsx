// // CusRentDateRange.tsx
// import { DatePicker } from "antd";
// import type { RangePickerProps } from "antd/es/date-picker";
// import dayjs from "dayjs";
// import "../style/CreateRentCar.css";

// const { RangePicker } = DatePicker;

// interface Props {
//   value?: RangePickerProps["value"];
//   onChange?: (dates: RangePickerProps["value"], dateStrings: [string, string]) => void;
// }

// export default function RentDateRange({ value, onChange }: Props) {
//   return (
//     <div className="rent-page-root" style={{ maxWidth: 500 }}>
//       <RangePicker
//         value={value}
//         onChange={onChange}
//         format="DD/MM/YYYY"
//         style={{ width: "100%" }}
//       />
//     </div>
//   );
// }

import { DatePicker } from "antd";
import type { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import "../style/CreateRentCar.css";

const { RangePicker } = DatePicker;

interface Props {
  value?: RangePickerProps["value"];
  onChange?: (dates: RangePickerProps["value"], dateStrings: [string, string]) => void;
}

export default function CusRentDateRange({ value, onChange }: Props) {
  return (
    <div className="rent-page-root" style={{ maxWidth: 500 }}>
      <RangePicker
        value={value}
        onChange={onChange}
        format="DD/MM/YYYY"
        style={{ width: "100%" }}
        disabledDate={(current) => current && current < dayjs().startOf("day")}
      />
    </div>
  );
}
