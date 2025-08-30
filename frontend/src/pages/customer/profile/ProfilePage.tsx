import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const CusProfilePage: React.FC = () => {
 

 return (
    <div style={{  minHeight: '100vh' }}>

        <Title level={2} style={{ color: 'white' }}>ข้อมูลของฉัน</Title>
        
     
    </div>
  );
};

export default CusProfilePage;