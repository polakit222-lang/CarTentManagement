import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const AppointmentAll: React.FC = () => {
 

  return (
    <div style={{ padding: '24px', background: '#828385ff', minHeight: '100vh',marginTop:'40px' }}>

        <Title level={2} style={{ color: '#FFD700'}}>การนัดหมายของฉัน</Title>
        
     
    </div>
  );
};

export default AppointmentAll;