import { useParams,useNavigate } from "react-router-dom";
import CarGrid from "../../../components/CarGrid";
import { carList } from "../../../data/carList";
import "../../../style/CreateSellCarPage.css"
import { carSellList } from "../../../data/carSellList";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
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
const salePersons = [
  { SalePerson_ID: 1, name: 'สมชาย' },
  { SalePerson_ID: 2, name: 'สมศรี' },
  { SalePerson_ID: 3, name: 'John Doe' },
];





function CreateSellCar() {
  const { id } = useParams(); // ดึง id จาก URL (string | undefined)
  const [form] = Form.useForm();
  const variant = Form.useWatch('variant', form);
  const navigate = useNavigate();


  // หาเฉพาะรถที่ id ตรงกัน
  const car = carList.find(c => c.id === Number(id));

  if (!car) {
    return <div>ไม่พบรถที่ต้องการ</div>;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = (values: any) => {
    // สร้างข้อมูลการเช่าใหม่
    const newSellEntry = {
      id: Number(id), // ID ของรถที่เลือก
      description: values.TextArea, // คำอธิบายจากฟอร์ม
      periods: values.rentPeriods, // ช่วงเวลาและราคาที่เช่า
    };

    // เพิ่มข้อมูลใหม่ลงใน carRentList (ในการใช้งานจริง ส่วนนี้จะเป็นการส่งข้อมูลไปที่ API)
    carSellList.push(newSellEntry);

    console.log("Form submitted:", values);
    console.log("New rent entry added:", newSellEntry);
    console.log("Updated carRentList:", carSellList);

    // หลังจากบันทึกเสร็จ ให้ redirect กลับไปที่หน้ารายการเช่า
    navigate('/sell');
  };


  return (
    <>
      <div >
        <h1 style={{ marginTop: 90, marginLeft: 30 }}>กรอกข้อมูลการขายเพิ่มเติม</h1>
        <div style={{ display: "flex", paddingRight: 10, paddingLeft: 10, width: '100%'}}>
          <div style={{ marginTop: 20 }}>
            <div className="showCar">
              <CarGrid cars={[car]} />
            </div>
          </div>
          <div style={{marginLeft:150 ,width:'100%',marginTop:40}}>
            <Form
              {...formItemLayout}
              form={form}
              variant={variant || 'outlined'}
              style={{ maxWidth: 500 }}
              initialValues={{ variant: 'outlined' }}
              onFinish={handleFormSubmit}
            >
              <Form.Item
                label="ป้อนคำโฆษณา"
                name="TextArea"
                rules={[{ required: true, message: 'โปรดป้อนคำอธิบาย' }]}
              >
                <Input.TextArea placeholder="กรอกคำอธิบายเพิ่มเติม..." size="large" />
              </Form.Item>

              <Form.Item
                label="ระบุราคาขาย"
                name="InputPrice"
                rules={[{ required: true, message: 'โปรดป้อนราคาขาย' }]}
              >
                <InputNumber<number>
                  style={{ width: '100%' }}
                  placeholder="กรอกราคาขาย"
                  size="large"
                  formatter={(value) =>
                    value !== undefined && value !== null
                      ? `฿ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                      : ''
                  }
                  parser={(displayValue) => {
                    const n = Number((displayValue ?? '').replace(/[^\d.-]/g, ''));
                    return Number.isNaN(n) ? NaN : n; // ต้องคืน number เสมอ
                  }}
                  min={0}
                />
              </Form.Item>

              <Form.Item label="ระบุส่วนลด" name="InputDiscount">
                <InputNumber<number>
                  style={{ width: '100%' }}
                  placeholder="กรอกส่วนลด"
                  size="large"
                  formatter={(value) =>
                    value !== undefined && value !== null ? `${value}%` : ''
                  }
                  parser={(displayValue) => {
                    const n = Number((displayValue ?? '').replace(/[^\d.-]/g, ''));
                    return Number.isNaN(n) ? NaN : n;
                  }}
                  min={0}
                  max={100}
                />
              </Form.Item>

              <Form.Item
                label="เลือกพนักงาน"
                name="SalePerson_ID"
                rules={[{ required: true, message: 'โปรดเลือกพนักงาน!' }]}
              >
                <Select placeholder="เลือกพนักงาน" size="large">
                  {salePersons.map((sp) => (
                    <Select.Option key={sp.SalePerson_ID} value={sp.SalePerson_ID}>
                      {sp.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <div>
                <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
                  <Button type="primary" htmlType="submit" size="large">
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateSellCar;