import React from "react";
import { Card, Col, Row } from "antd";
import type{ CarInfo } from "../interface/Car";

interface CarGridProps {
  cars: CarInfo[];
}

const CarGrid: React.FC<CarGridProps> = ({ cars }) => {
  return (
    <Row gutter={[16, 16]}>
      {cars.map((car) => (
        <Col span={8} key={car.ID}>
          <Card
            title={`${car.brand?.brandName ?? ""} ${car.model?.modelName ?? ""}`}
            cover={
              car.pictures && car.pictures.length > 0 ? (
                <img
                  alt={car.carName}
                  src={car.pictures[0].path}
                  style={{ height: 200, objectFit: "cover" }}
                />
              ) : null
            }
          >
            <p>{car.carName}</p>
            <p>ปี {car.yearManufacture}</p>
            <p>ราคา {car.purchasePrice.toLocaleString()} บาท</p>
            <p>สี {car.color}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default CarGrid;
