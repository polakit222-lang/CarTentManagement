import { useParams, useNavigate } from "react-router-dom";
import CarGrid from "../../../components/CarGrid";
import { carList } from "../../../data/carList";
import "../../../style/CreateSellCarPage.css";
import RentDateRange from "../../../components/RentDateRange";
import { carRentList } from "../../../data/carRentList"; // 👈 1. Import carRentList
import {
  Button,
  Form,
  Input,
} from 'antd';

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 30 },
  },
};

function CreateRentCarPage() {
  const { id } = useParams();
  const navigate = useNavigate(); // 👈 2. เรียกใช้ useNavigate hook
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);

  const car = carList.find(c => c.id === Number(id));

  if (!car) {
    return <div>ไม่พบรถที่ต้องการ</div>;
  }

  // 👇 3. สร้างฟังก์ชันสำหรับ handle การ submit
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (values: any) => {
    // สร้างข้อมูลการเช่าใหม่
    const newRentEntry = {
      id: Number(id), // ID ของรถที่เลือก
      description: values.TextArea, // คำอธิบายจากฟอร์ม
      periods: values.rentPeriods, // ช่วงเวลาและราคาที่เช่า
    };

    // เพิ่มข้อมูลใหม่ลงใน carRentList (ในการใช้งานจริง ส่วนนี้จะเป็นการส่งข้อมูลไปที่ API)
    carRentList.push(newRentEntry);

    console.log("Form submitted:", values);
    console.log("New rent entry added:", newRentEntry);
    console.log("Updated carRentList:", carRentList);

    // หลังจากบันทึกเสร็จ ให้ redirect กลับไปที่หน้ารายการเช่า
    navigate('/rent');
  };

  return (
    <>
      <div style={{  minHeight: '110vh' }}>
        <h1 style={{ marginTop: 90, marginLeft: 30 }}>กรอกข้อมูลการเช่าเพิ่มเติม</h1>
        <div style={{ display: "flex", paddingRight: 10, paddingLeft: 10, width: '100%' }}>
          <div style={{ marginTop: 20 }}>
            <div className="showCar">
              <CarGrid cars={[car]} />
            </div>
          </div>
          <div style={{ marginLeft: 150, width: '100%', marginTop: 40 }}>
            <Form
              {...formItemLayout}
              form={form}
              variant={variant || "outlined"}
              style={{ maxWidth: 500 }}
              initialValues={{ variant: "outlined" }}
              onFinish={handleFormSubmit} // 👈 4. เรียกใช้ฟังก์ชันที่สร้างขึ้น
            >
              <Form.Item
                name="TextArea"
                rules={[{ required: true, message: "โปรดป้อนคำอธิบาย" }]}
              >
                <Input.TextArea
                  placeholder="กรอกคำอธิบายเพิ่มเติม..."
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="rentPeriods"
                valuePropName="value"
              >
                <RentDateRange />
              </Form.Item>

              <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                <Button type="primary" htmlType="submit" size="large">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateRentCarPage;