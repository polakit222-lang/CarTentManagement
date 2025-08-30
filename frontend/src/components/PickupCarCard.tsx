import React from 'react';
import { Card, Button, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';

const { Text } = Typography;

interface InspectionCardProps {
  label: string;
  iconType?: React.ReactNode;
  isSelected: boolean;
  onSelect: () => void;
}

const InspectionCard: React.FC<InspectionCardProps> = ({ label, iconType, isSelected, onSelect }) => (
  <Card
    hoverable
    className="inspection-card"
    style={{
      width: '100%',
      minHeight: '200px',
      textAlign: 'center',
      border: isSelected ? '2px solid #f1d430ff' : '1px solid #807e7eff',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#4A4A4A',
      transition: 'all 0.2s ease-in-out',
    }}
    bodyStyle={{ padding: '12px', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
    onClick={onSelect} // Allow clicking anywhere on the card to select
  >
    {iconType ? (
        <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '64px', color: isSelected ? '#f1d430ff' : '#ccc' }}>
              {iconType}
          </div>
        </div>
    ) : (
        <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white' }}>Image Placeholder</Text>
        </div>
    )}
    <div style={{ marginTop: '8px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <Text strong style={{ minHeight: '40px', color: 'white' }}>{label}</Text>
      <Button 
        className="inspection-card-button" 
        style={{ 
            width: '100%', 
            marginTop: '8px', 
            backgroundColor: isSelected ? '#f1d846ff' : '#363636', 
            borderColor: isSelected ? '#f1d846ff' : '#888', 
            color: isSelected ? 'black' : 'white',
            fontWeight: 'bold'
        }}
        icon={isSelected ? <CheckCircleFilled /> : undefined}
      >
        {isSelected ? 'เลือกแล้ว' : 'เลือก'}
      </Button>
    </div>
  </Card>
);

export default InspectionCard;