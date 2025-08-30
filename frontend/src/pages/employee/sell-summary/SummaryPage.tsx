import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const SummaryPage: React.FC = () => {
 

  return (
    <div style={{ padding: '24px', background: '#828385ff', minHeight: '100vh',marginTop:'40px' }}>

        <Title level={2} style={{ color: '#FFD700'}}>ยอดขายของฉัน</Title>
        <p>เอาไว้แสดงยอดขายของพนักงานคนนั้นๆที่ล็อกอิน</p>
        
     
    </div>
  );
};

export default SummaryPage;