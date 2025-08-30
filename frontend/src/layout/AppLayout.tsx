import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar'; // <-- ควร import Navbar ปกติ

const { Content, Footer } = Layout;

const AppLayout: React.FC = () => {
  return (
    <Layout>
      <Navbar /> {/* <-- และเรียกใช้ Navbar ที่นี่ */}
      <Content>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center', background: '#4A4A4A', color: 'white' }}>
        Ant Design ©{new Date().getFullYear()} Created by G14 Used Car tent
      </Footer>
    </Layout>
  );
};

export default AppLayout;