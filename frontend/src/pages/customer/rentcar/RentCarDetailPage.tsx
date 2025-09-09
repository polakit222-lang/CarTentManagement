import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  Typography,
  Image,
  Button,
  Divider,
  Form,
  Modal,
  message,
} from "antd";
import { PushpinOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { carList } from "../../../data/carList";

import CusRentDateRange from "../../../components/CusRentDateRange";
// import type { RentPeriod } from "../../../components/CusRentDateRange";

import mainCar from "../../../assets/rentCar1/carMain.jpg";
import thumb1 from "../../../assets/rentCar1/thumb1.jpg";
import thumb2 from "../../../assets/rentCar1/thumb2.jpg";
import thumb3 from "../../../assets/rentCar1/thumb3.jpg";
import thumb4 from "../../../assets/rentCar1/thumb4.jpg";

const { Title } = Typography;

const RentCarDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [rentModalVisible, setRentModalVisible] = useState(false);

  const [selectedRentRange, setSelectedRentRange] = useState<dayjs.Dayjs[]>([]);

  const car = carList.find((c) => c.id === Number(id));
  if (!car) return <div>ไม่พบรถที่ต้องการ</div>;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleFormSubmit = (values: any) => {
    if (!values.rentRange || values.rentRange.length === 0) {
      message.error("โปรดเลือกช่วงเวลาที่ต้องการเช่า");
      return;
    }
    setSelectedRentRange(values.rentRange);
    setRentModalVisible(true);
  };

  const handleConfirmRent = () => {
    message.success("ทำการจองเรียบร้อยแล้ว!");
    setRentModalVisible(false);
    form.resetFields(["rentRange"]); // ✅ reset ค่า rentRange ในฟอร์ม
    navigate("/rent");
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
              <p>สี: </p>
            </div>

            <Divider style={{ borderColor: "rgba(255, 215, 0, 0.3)" }} />

            {/* รายละเอียดพนักงาน */}
            <div style={{ color: "#fff", lineHeight: "1.8em" }}>
              <Title level={4} style={{ color: "gold", marginTop: "-10px" }}>
                ติดต่อพนักงาน
              </Title>
              <p>ชื่อ: Lung Tuu</p>
              <p>เบอร์โทร: 09888866</p>
            </div>

            <Divider style={{ borderColor: "rgba(255, 215, 0, 0.3)" }} />

            {/* ปฏิทินเลือกวันที่ */}
            <Form
              form={form}
              layout="vertical"
              onFinish={handleFormSubmit} // ✅ ต้องมี
            >
              <Form.Item
                name="rentRange"
                label={<span style={{ color: "white", fontWeight: "bold" }}>เลือกช่วงเช่า</span>}
                rules={[{ required: true, message: "โปรดเลือกช่วงเวลาที่ต้องการเช่า" }]}
              >
                <CusRentDateRange />
              </Form.Item>

              <Button
                icon={<PushpinOutlined />}
                block
                htmlType="submit" // ✅ ต้องมี
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
              >
                สั่งเช่า
              </Button>
            </Form>

              {/* Modal ที่ถูกลบเนื้อหาตรงกลางออก */}
              <Modal
                title={<span style={{ color: "black", fontWeight: "bold" }}>ยืนยันการเช่า</span>}
                open={rentModalVisible}
                onOk={handleConfirmRent}
                onCancel={() => setRentModalVisible(false)}
                okText="ยืนยัน"
                cancelText="ยกเลิก"
                className="custom-rent-modal"
                okButtonProps={{ 
                  style: { 
                    backgroundColor: "gold", 
                    color: "black", 
                    borderColor: "gold", 
                    borderRadius: "8px",
                    fontWeight: "bold",
                  },
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = "#ccac00";
                    (e.target as HTMLElement).style.color = "black";
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = "gold";
                    (e.target as HTMLElement).style.color = "black";
                  },
                }}
                cancelButtonProps={{ 
                  style: { 
                    backgroundColor: "#e0e0e0",
                    color: "black", 
                    borderColor: "#d0d0d0", 
                    borderRadius: "8px",
                    fontWeight: "bold",
                  },
                  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = "#c0c0c0";
                  },
                  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
                    (e.target as HTMLElement).style.backgroundColor = "#e0e0e0";
                  },
                }}
                bodyStyle={{ 
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "0 0 8px 8px", 
                }}
              >
                {selectedRentRange.length === 2 && (
                  <div style={{ color: "#000000ff" }}>
                    <p>วันเริ่ม: {selectedRentRange[0].format("DD/MM/YYYY")}</p>
                    <p>วันสิ้นสุด: {selectedRentRange[1].format("DD/MM/YYYY")}</p>
                  </div>
                )}
                {/* เนื้อหาส่วนนี้ถูกลบออกไปแล้ว */}
              </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RentCarDetailPage;