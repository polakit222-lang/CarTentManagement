// components/CarCard.tsx
import React, { useState, useRef } from "react";
import type { CarInfo, CarType } from "../interface/Car";
import { Card, Typography, Tag, Modal, Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface CarCardProps {
  car: CarInfo;
  type: CarType;
  onEdit: () => void;
}

// ฟังก์ชันคำนวณอายุรถ
const calculateCarAge = (startUseDate?: string) => {
  if (!startUseDate) return undefined;
  const startDate = new Date(startUseDate);
  const now = new Date();
  let age = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < startDate.getDate())) {
    age -= 1;
  }
  return age;
};

// ฟังก์ชันกำหนดสี Tag ตาม type
const getStatusTag = (type: CarType) => {
  switch (type) {
    case "rent":
      return <Tag color="blue">กำลังปล่อยเช่า</Tag>;
    case "sale":
      return <Tag color="green">กำลังขาย</Tag>;
    case "noUse":
      return <Tag color="gray">ว่าง</Tag>;
    default:
      return <Tag color="red">ขายแล้ว</Tag>;
  }
};

const CarCard: React.FC<CarCardProps> = ({ car, type, onEdit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const carouselRef = useRef<any>(null);

  const images = car.pictures?.map((p) => `http://localhost:8080/images/cars/${p.path}`) || [];
  const carAge = calculateCarAge(car.startUseDate);

  return (
    <>
      <Card
        hoverable
        style={{ width: 300, margin: 10 }}
        cover={
          images.length ? (
            <img
              alt={car.carName}
              src={images[0]}
              onClick={() => setIsOpen(true)}
              style={{ cursor: "pointer", objectFit: "cover", height: 180 }}
            />
          ) : null
        }
        onClick={onEdit}
      >
        <Title level={5}>{car.carName} ปี {car.yearManufacture}</Title>
        {getStatusTag(type)}
        <br />
        <Text>สี: {car.color}</Text>
        <br />
        <Text>ราคาซื้อ: {car.purchasePrice.toLocaleString()} บาท</Text>
        <br />
        {type === "sale" && car.sale_list?.length ? (
          <Text>ราคาขาย: {car.sale_list[0].sale_price.toLocaleString()} บาท</Text>
        ) : null}
        {type === "rent" && car.rent_list?.length ? (
          <>
            <Text>ราคาเช่า: {car.rent_list[0].rent_price.toLocaleString()} บาท / วัน</Text>
            <br />
            <Text>เริ่มเช่า: {car.rent_list[0].rent_start_date}</Text>
          </>
        ) : null}
        <br />
        {carAge !== undefined && <Text>อายุรถ: {carAge} ปี</Text>}
        <br />
        <Text>เลขไมล์: {car.mileage?.toLocaleString()}</Text>
        <br />
        <Text>สภาพ: {car.condition}</Text>
      </Card>

      {/* Modal สำหรับแสดงภาพ */}
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        width={600}
      >
        <div style={{ position: "relative" }}>
          <Carousel ref={carouselRef} dots={false}>
            {images.map((img, idx) => (
              <div key={idx}>
                <img
                  src={img}
                  alt={`car-${idx}`}
                  style={{ width: "100%", maxHeight: "500px", objectFit: "contain" }}
                />
              </div>
            ))}
          </Carousel>

          {/* ปุ่มลูกศร */}
          <LeftOutlined
            onClick={() => carouselRef.current.prev()}
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              fontSize: "24px",
              color: "#000",
              cursor: "pointer",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.5)",
              borderRadius: "50%",
              padding: 5,
            }}
          />
          <RightOutlined
            onClick={() => carouselRef.current.next()}
            style={{
              position: "absolute",
              top: "50%",
              right: 0,
              fontSize: "24px",
              color: "#000",
              cursor: "pointer",
              transform: "translateY(-50%)",
              zIndex: 10,
              background: "rgba(255,255,255,0.5)",
              borderRadius: "50%",
              padding: 5,
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default CarCard;
