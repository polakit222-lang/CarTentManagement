// src/layout/ManagerLayout.tsx
import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import NavbarManager from '../components/NavbarManager';

const { Content, Footer } = Layout;

const ManagerLayout: React.FC = () => {
  return (
    <Layout>
      <NavbarManager />
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

export default ManagerLayout;