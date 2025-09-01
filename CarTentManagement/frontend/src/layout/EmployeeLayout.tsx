// src/layout/ManagerLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import NavBarEmployee from '../components/NavBarEmployee';

const { Content, Footer } = Layout;

const EmployeeLayout: React.FC = () => {
  return (
    <Layout>
      <NavBarEmployee />
      {/* VVV แก้ไข Style ของ Content ที่นี่ VVV */}
      <Content style={{ padding: 0 }}> {/* <--- เปลี่ยน padding เป็น 0 */}
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#4A4A4A', color: 'white' }}>
        Ant Design ©{new Date().getFullYear()} Created by G14 Used Car tent
      </Footer>
    </Layout>
  );
};

export default EmployeeLayout;