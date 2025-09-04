import React, { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { Row, Col, Card, Typography, Image, Button, Divider, Space, Modal } from "antd";
import { MessageOutlined, ShopOutlined, ShoppingCartOutlined, PushpinOutlined } from "@ant-design/icons";

// import CarGrid from "../../../components/CarGrid";
import { carList } from "../../../data/carList";
import { carSellList } from "../../../data/carSellList";

import mainCar from "../../../assets/burCar1/carMain.jpg";
import thumb1 from "../../../assets/burCar1/thumb1.jpg";
import thumb2 from "../../../assets/burCar1/thumb2.jpg";
import thumb3 from "../../../assets/burCar1/thumb3.jpg";
import thumb4 from "../../../assets/burCar1/thumb4.jpg";

const { Title, Text, Paragraph } = Typography;

const BuyCarDetailPage: React.FC = () => {

  const { id } = useParams(); // ดึง id จาก URL (string | undefined)
  // const [form] = Form.useForm();
  // const variant = Form.useWatch('variant', form);
  const navigate = useNavigate();


  // หาเฉพาะรถที่ id ตรงกัน
  const car = carList.find(c => c.id === Number(id));

  if (!car) {
    return <div>ไม่พบรถที่ต้องการ</div>;
  }

  const [buy, setbuy] = useState(false);
  const [book, setbook] = useState(false);

  return (
    <div style={{ backgroundColor: "#000", minHeight: "100vh", padding: "20px" }}>
      <Row gutter={16}>
        {/* ภาพใหญ่และภาพย่อย */}
        <Col xs={24} md={16}>
          <Card bordered={false} style={{ backgroundColor: "#262626" }}>
            {/* ภาพใหญ่ */}
            <Image
              src={mainCar}
              alt="car-main"
              style={{ borderRadius: "10px", marginBottom: "10px" }}
            />

            {/* ภาพย่อย 4 รูป */}
            <Row gutter={8}>
              {[thumb1, thumb2, thumb3, thumb4].map((thumb, i) => (
                <Col span={6} key={i}>
                  <Image src={thumb} 
                  alt={`car-${i}`} 
                  style={{ borderRadius: "6px" }}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* ข้อมูลด้านขวา */}
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: "#262626", color: "white" }}>
            <Title level={3} style={{ color: "white" }}>
              TOYOTA YARIS ATIV 1.2 E ปี 2020
            </Title>
            <Title level={2} style={{ color: "#fff", marginTop: "-10px" }}>
              ฿ 319,000
            </Title>
            {/* <Text style={{ color: "#aaa" }}>โพสต์เมื่อ 2 เดือนที่ผ่านมา</Text> */}

            {/* <Divider style={{ borderColor: "#ffffffff" }} />

            <Space size="large" style={{ marginBottom: "10px" }}>
              <HeartOutlined style={{ fontSize: "20px", color: "#fff" }} />
              <ShareAltOutlined style={{ fontSize: "20px", color: "#fff" }} />
            </Space> */}

            <Divider style={{ borderColor: "#ffffffff" }} />

            {/* รายละเอียด */}
            <div style={{ color: "#fff", lineHeight: "1.8em" }}>
              <p>ยี่ห้อ: Toyota</p>
              <p>รุ่น: Yaris Ativ</p>
              <p>ปี: 2020</p>
              <p>เลขไมล์: 50,000 กม.</p>
              <p>เกียร์: ออโต้</p>
              <p>สี: ดำ</p>
            </div>

            <Divider style={{ borderColor: "#ffffffff" }} />

            {/* รายละเอียดพนังงาน */}
            <div style={{ color: "#fff", lineHeight: "1.8em" }}>
              <Title level={3} style={{ color: "#fff", marginTop: "-10px" }}>
              ติดต่อพนังงาน
              </Title>

              <p>ชื่อ: Lung Tuu</p>
              <p>เบอร์โทร: 09888866</p>

            </div>

            <Divider style={{ borderColor: "#ffffffff" }} />

            {/* ปุ่มติดต่อ */}
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button 
                icon={<PushpinOutlined />} block
                  onClick={() => {
                    setbook(true);
                  }}
                >
                  จอง
              </Button>
                <Modal
                  open={book}
                  afterOpenChange={(open) => {
                    setbook(open);
                  }}
                  onCancel={() => {
                    setbook(false);
                  }}
                  onOk={() => setbook(false)}
                >
                  <Title level={3} style={{ color: "back" }}>
                    ยืนยันคำสั่งการจอง
                  </Title>
                </Modal>

              <Button
                icon={<ShoppingCartOutlined />} type="primary" block
                  onClick={() => {
                    setbuy(true);
                  }}
                >
                  สั่งซื้อ
              </Button>
                <Modal
                  open={buy}
                  afterOpenChange={(open) => {
                    setbuy(open);
                  }}
                  onCancel={() => {
                    setbuy(false);
                  }}
                  onOk={() => setbuy(false)}
                >
                  <Title level={3} style={{ color: "back" }}>
                    ยืนยันคำสั่งซื้อ
                  </Title>
                </Modal>

{/* 
              <Button icon={<ShopOutlined />} block>
                ร้านค้า
              </Button> */}

            </Space>
          </Card>
        </Col>
      </Row>

      {/* รายละเอียดเพิ่มเติม */}
      <Card style={{ marginTop: "20px", backgroundColor: "#262626", color: "white" }} bordered={false}>
        <Title level={4} style={{ color: "white" }}>
          รายละเอียด
        </Title>
        <Paragraph style={{ color: "#ccc" }}>
          TOYOTA YARIS ATIV 1.2 E ปี 2020<br />
          - สภาพเหมือนป้ายแดง จัดไฟแนนซ์ได้<br />
          - เครื่องยนต์เกียร์ ช่วงล่างแน่น<br />
          - พร้อมรับประกันศูนย์ Toyota
        </Paragraph>
      </Card>
    </div>
  );
};

export default BuyCarDetailPage;