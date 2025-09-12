import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
import { PushpinOutlined, } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { carList } from "../../../data/carList";

import CusRentDateRange from "../../../components/CusRentDateRange";
// import type { RentPeriod } from "../../../components/CusRentDateRange";

import { useAuth } from "../../../hooks/useAuth";

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
  const { user } = useAuth(); //add
  const location = useLocation();

  const [rentModalVisible, setRentModalVisible] = useState(false);

  const [selectedRentRange, setSelectedRentRange] = useState<dayjs.Dayjs[]>([]);

  const car = carList.find((c) => c.id === Number(id));
  if (!car) return <div>ไม่พบรถที่ต้องการ</div>;

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const handleFormSubmit = (values: any) => {
    if (!values.rentRange || values.rentRange.length === 0) {
      if (!user) {
        // ถ้ายังไม่ล็อกอิน → ไปหน้า login พร้อมส่ง path ปัจจุบัน + flag ว่าต้องเปิด modal
        navigate("/login", { state: { from: location.pathname, openModal: "rent" } });
      }
      message.error("โปรดเลือกช่วงเวลาที่ต้องการเช่า");
      return;
    }
    setSelectedRentRange(values.rentRange);
    setRentModalVisible(true);
  };

  // const handleConfirmRent = () => {
  //   setRentModalVisible(false); // ✅ ปิด modal ก่อน
  //   if (user) {
  //     navigate("/payment");
  //   } else {
  //     navigate("/login", { state: { from: "/payment" } });
  //   }
  // };

  useEffect(() => {
    if (user && location.state?.openModal === "rent") {
      setRentModalVisible(true);
      navigate(location.pathname, { replace: true });
    }
  }, [user, location, navigate]);

  // ฟังก์ชันกดปุ่มสั่งซื้อ
  // const handleRentClick = () => {
  //   if (!user) {
  //     // ถ้ายังไม่ล็อกอิน → ไปหน้า login พร้อมส่ง path ปัจจุบัน + flag ว่าต้องเปิด modal
  //     navigate("/login", { state: { from: location.pathname, openModal: "rent" } });
  //   } else {
  //     setRentModalVisible(true);
  //   }
  // };

  // ฟังก์ชันยืนยันสั่งซื้อ
  const handleConfirmRent = () => {
    setRentModalVisible(false);
    message.success("ยืนยันการสั่งเช่าแล้ว กำลังพาไปหน้าชำระเงิน...");
    navigate("/payment");
  };


  useEffect(() => {
  if (rentModalVisible) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
  return () => {
    document.body.style.overflow = "";
  };
}, [rentModalVisible]);

  return (
    <div       
      className={`page-container ${rentModalVisible ? "blurred" : ""}`} // ✅ เพิ่ม class blur เมื่อ modal เปิด
      style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px", transition: "filter 0.3s ease" }}>
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
              ฿ {car.price.toLocaleString()}/วัน
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
                onClick={handleFormSubmit}
              >
                สั่งเช่า
              </Button>
            </Form>
              <Modal
                title={<span style={{ color: '#f1d430ff' }}>ยืนยันคำสั่งเช่า</span>}
                open={rentModalVisible}
                onCancel={() => setRentModalVisible(false)}
                getContainer={() => document.body} // ← บังคับให้ render เป็น portal ที่ body
                maskClosable={false}
                width={600}
                centered
                styles={{ 
                    body: { 
                        backgroundColor: '#000000' 
                    },
                    header: {
                        backgroundColor: '#000000',
                        borderBottom: '1px solid #000000'
                    },
                    footer: {
                        backgroundColor: '#000000',
                        borderTop: '1px solid #000000'
                    },
                    content: {
                        backgroundColor: '#000000',
                        border: '2px solid #f1d430ff',
                        borderRadius: '8px'
                    }
                }}
                footer={[
                    <Button 
                        key="back" 
                        onClick={() => setRentModalVisible(false)}
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
                        ยกเลิก
                    </Button>,
                    <Button 
                        key="submit" 
                        onClick={handleConfirmRent}
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
                        ยืนยัน
                    </Button>,
                ]}
              >
              <div style={{ color: 'white' }}>
                <p>ชื่อ-นามสกุล : </p>
                <p>รถยนต์ : {car.brand} {car.model} ปี {car.yearManufactured}</p>
                {selectedRentRange.length === 2 && (() => {
                  const startDate = selectedRentRange[0];
                  const endDate = selectedRentRange[1];
                  const days = endDate.diff(startDate, "day") + 1; // ✅ รวมวันเริ่มต้นด้วย
                  const totalPrice = days * car.price;
                  return (
                    <>
                      <p>วันเริ่ม: {startDate.format("DD/MM/YYYY")}</p>
                      <p>วันสิ้นสุด: {endDate.format("DD/MM/YYYY")}</p>
                      <p>จำนวนวัน: {days} วัน</p>
                      <p>ราคา: {totalPrice.toLocaleString()} บาท</p>
                    </>
                  );
                })()}
              </div>
              </Modal>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default RentCarDetailPage;