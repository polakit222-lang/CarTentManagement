import React from 'react';
import {  Typography } from 'antd';

const { Title } = Typography;

const PaymentPage: React.FC = () => {


 return (
    <div style={{  minHeight: '100vh' }}>

        <Title level={2} style={{ color: 'white' }}>หน้าสำหรับการชำระเงิน</Title>
        
     
    </div>
  );
};

export default PaymentPage;