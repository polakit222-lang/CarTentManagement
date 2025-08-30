// src/components/InspectionCard.tsx
import React, { useState } from 'react';
import { Card, Button, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons'; // เพิ่มการนำเข้าไอคอน

const { Text } = Typography;

interface InspectionCardProps {
  label: string;
  iconType?: React.ReactNode;
  systemId: number; // เพิ่ม prop systemId สำหรับระบุ ID ของระบบ
  onChange: (systemId: number, isSelected: boolean) => void; // เพิ่ม prop onChange เพื่อแจ้งสถานะการเลือก
  initialSelected?: boolean; // เพิ่ม prop สำหรับกำหนดสถานะเริ่มต้น (เผื่อใช้ในหน้าแก้ไข)
}

const InspectionCard: React.FC<InspectionCardProps> = ({ label, iconType, systemId, onChange, initialSelected = false }) => {
  const [isSelected, setIsSelected] = useState<boolean>(initialSelected);

  const handleClick = () => {
    const newState = !isSelected;
    setIsSelected(newState);
    onChange(systemId, newState); // เรียกใช้ onChange prop เพื่อส่งสถานะการเลือกกลับไป
  };

  return (
    <Card
      hoverable
      className="inspection-card" // เพิ่ม className เพื่อกำหนดสไตล์ hover
      style={{
        width: '100%',
        minHeight: '200px',
        textAlign: 'center',
        border: `1px solid ${isSelected ? '#f1d430ff' : '#807e7eff'}`, // เปลี่ยนสี border เมื่อถูกเลือก
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: isSelected ? '#f1d43033' : '#4A4A4A', // เปลี่ยนสีพื้นหลังเมื่อถูกเลือก (โปร่งใสขึ้นเล็กน้อย)
        transition: 'all 0.3s ease-in-out', // เพิ่ม transition เพื่อความ smooth
      }}
      bodyStyle={{ padding: '12px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    >
      {/* ตรวจสอบว่ามี iconType หรือไม่ ถ้ามีให้แสดงไอคอน ถ้าไม่มีให้แสดง Image Placeholder */}
      <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {iconType ? (
          <div style={{ fontSize: '64px', color: '#f1d430ff' }}>
            {iconType}
          </div>
        ) : (
          <Text style={{ color: 'white' }}>Image Placeholder</Text>
        )}
        {isSelected && ( // แสดง CheckCircleOutlined เมื่อถูกเลือก
          <CheckCircleOutlined 
            style={{ 
              position: 'absolute', 
              top: '5px', 
              right: '5px', 
              fontSize: '24px', 
              color: '#00a854' // สีเขียวสำหรับไอคอนถูกเลือก
            }} 
          />
        )}
      </div>
      <div style={{ marginTop: '8px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <Text strong style={{ minHeight: '40px', color: 'white' }}>{label}</Text>
        <Button 
          className="inspection-card-button" 
          style={{ 
            width: '100%', 
            marginTop: '8px', 
            backgroundColor: isSelected ? '#00a854' : '#f1d846ff', // เปลี่ยนสีปุ่มเมื่อถูกเลือก
            borderColor: isSelected ? '#00a854' : '#f1d846ff', 
            color: isSelected ? 'white' : 'black', // เปลี่ยนสีข้อความปุ่ม
            transition: 'all 0.3s ease-in-out',
          }}
          onClick={handleClick}
        >
          {isSelected ? 'เลือกแล้ว' : 'เลือก'} {/* เปลี่ยนข้อความปุ่ม */}
        </Button>
      </div>
    </Card>
  );
};

export default InspectionCard;
