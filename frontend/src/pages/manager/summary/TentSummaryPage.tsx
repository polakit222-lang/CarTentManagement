import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const TentSummaryPage: React.FC = () => {
 

  return (
    <div style={{ padding: '24px', background: '#828385ff', minHeight: '100vh',marginTop:'40px' }}>

        <Title level={2} style={{ color: '#FFD700'}}>สรุปยอด</Title>
        <p>เอาไว้แสดงรายละเอียดยอดขายทั้งหมดของทั้งเต็นท์ ฯลฯ ที่เรื่องอื่นๆเกี่ยวกับเต็นท์ </p>
        
     
    </div>
  );
};

export default TentSummaryPage;