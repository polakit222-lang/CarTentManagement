import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Image,
  Button,
  Divider,
  Form,
  DatePicker,
  Modal,
  Alert,
  message,
} from "antd";
import { ShoppingCartOutlined, PushpinOutlined, CalendarOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import { carList } from "../../../data/carList";

import mainCar from "../../../assets/rentCar1/carMain.jpg";
import thumb1 from "../../../assets/rentCar1/thumb1.jpg";
import thumb2 from "../../../assets/rentCar1/thumb2.jpg";
import thumb3 from "../../../assets/rentCar1/thumb3.jpg";
import thumb4 from "../../../assets/rentCar1/thumb4.jpg";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const RentCarDetailPage: React.FC = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [rentModalVisible, setRentModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // state สำหรับแสดง error

  const car = carList.find((c) => c.id === Number(id));
  if (!car) return <div>ไม่พบรถที่ต้องการ</div>;

    useEffect(() => {
      window.scrollTo({ top: 0 });
    }, []);

  const handleFormSubmit = () => {
    if (!dateRange) {
      setErrorMessage("โปรดเลือกช่วงระยะเวลาที่ต้องการเช่า"); // แสดงข้อความเตือน
      return;
    }
    setErrorMessage(""); // ล้างข้อความเตือนถ้ามีการเลือกวันที่แล้ว
    setRentModalVisible(true);
  };

  const handleConfirmRent = () => {
  message.success("ทำการจองเรียบร้อยแล้ว!");
  setDateRange(null); // รีเซตปฏิทินให้กลับไปเป็นค่าเริ่มต้น
  setRentModalVisible(false);
};

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px" }}>
      <Row gutter={16}>
        {/* ภาพใหญ่และภาพย่อย */}
        <Col xs={24} md={16}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#1a1a1a",
              borderRadius: 12,
              border: "2px solid gold",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.4)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <Image
              src={mainCar}
              alt="car-main"
              style={{ borderRadius: "12px", marginBottom: "10px" }}
            />
            <Row gutter={8}>
              {[thumb1, thumb2, thumb3, thumb4].map((thumb, i) => (
                <Col span={6} key={i}>
                  <Image src={thumb} alt={`car-${i}`} style={{ borderRadius: "8px" }} />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* ข้อมูลด้านขวา */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              backgroundColor: "#1a1a1a",
              color: "white",
              borderRadius: 12,
              border: "2px solid gold",
              transition: "box-shadow 0.3s ease-in-out",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.4)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <Title level={3} style={{ color: "gold" }}>
              {car.brand} {car.model} ปี {car.yearManufactured}
            </Title>
            <Title level={2} style={{ color: "white", marginTop: "-10px" }}>
              ฿ {car.price}/วัน
            </Title>

            <Divider style={{ borderColor: "rgba(255, 215, 0, 0.3)" }} />

            {/* รายละเอียดรถ */}
            <div style={{ color: "#fff", lineHeight: "1.8em" }}>
              <p>ยี่ห้อ: {car.brand}</p>
              <p>รุ่น: {car.model}</p>
              <p>ปี: {car.yearManufactured}</p>
              <p>เลขไมล์: {car.mileage?.toLocaleString()} กม.</p>
              <p>เกียร์: </p>
              <p>สี: </p>

              {/* <p>เกียร์: {car.gear}</p>
              <p>สี: {car.color}</p> */}
            </div>

            <Divider style={{ borderColor: "rgba(255, 215, 0, 0.3)" }} />

            {/* ปฏิทินเลือกวันที่ */}
            <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
              <Form.Item
                label={<span style={{ color: "white", fontWeight: "bold" }}>เลือกช่วงเช่า</span>}
              >
                <RangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                  disabledDate={(current) => current && current < dayjs().startOf("day")}
                  format="DD/MM/YYYY"
                  style={{
                    width: "100%",
                    borderRadius: 10,
                    border: "2px solid gold",
                    backgroundColor: "#1a1a1a",
                    color: "white",
                  }}
                  suffixIcon={<CalendarOutlined style={{ color: "gold" }} />}
                />
                {/* ✅ แสดงข้อความเตือนถ้ายังไม่ได้เลือก */}
                {errorMessage && (
                  <div style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
                    {errorMessage}
                  </div>
                )}
              </Form.Item>

              <Button
                icon={<PushpinOutlined />}
                block
                style={{
                  backgroundColor: "gold",
                  color: "black",
                  fontWeight: "bold",
                  border: "2px solid gold",
                  borderRadius: "10px",
                  boxShadow: "0 2px 8px rgba(255, 215, 0, 0.4)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "black";
                  e.currentTarget.style.color = "gold";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "gold";
                  e.currentTarget.style.color = "black";
                }}
                htmlType="submit"
              >
                สั่งเช่า
              </Button>

              {/* Modal ยืนยันเช่า */}
              <Modal
                title={<span style={{ color: "#000000ff", fontWeight: "bold" }}>ยืนยันการเช่า</span>}
                open={rentModalVisible}
                onOk={handleConfirmRent}
                onCancel={() => setRentModalVisible(false)}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
                bodyStyle={{ backgroundColor: "#ffffffff", color: "#000000ff" }}
              >
                {dateRange && (
                  <div style={{ color: "#000000ff" }}>
                    <p>วันเริ่ม: {dateRange[0].format("DD/MM/YYYY")}</p>
                    <p>วันสิ้นสุด: {dateRange[1].format("DD/MM/YYYY")}</p>
                  </div>
                )}
              </Modal>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RentCarDetailPage;
