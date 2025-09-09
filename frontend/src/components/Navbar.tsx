// src/components/Navbar.tsx
import React, { useState } from 'react';
import { Layout, Button, Row, Col, Drawer, Menu } from 'antd';
import type { MenuProps } from 'antd';
import { MenuOutlined, LogoutOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';
import { drawerMenuItems as baseMenuItems } from '../data/data';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


const { Header } = Layout;

type MenuItemType = Required<MenuProps>['items'][number] & {
  path?: string;
};

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  // --- vvv แก้ไข vvv ---
  const { user, logout, role } = useAuth(); // เปลี่ยนมาใช้ user object
  // --- ^^^ แก้ไข ^^^ ---

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const getMenuItems = (): MenuItemType[] => {
    const menu: MenuItemType[] = [...baseMenuItems];

    // --- vvv แก้ไข vvv ---
    // ตรวจสอบจาก user object และ user.role
    if (user && role === 'customer') {
      // --- ^^^ แก้ไข ^^^ ---
      menu.push(
        { key: 'payment', label: 'การชำระเงิน', path: '/payment' },
        { key: 'buy-insurance', label: 'ซื้อประกัน', path: '/buy-insurance' },
        { key: 'inspection', label: 'นัดตรวจสภาพรถยนต์', path: '/inspection-car' },
        { key: 'pickup-car', label: 'นัดรับ-ส่งรถยนต์', path: '/pickup-car' },
        { type: 'divider' },
        { key: 'profile', label: 'ข้อมูลของฉัน', icon: <UserOutlined />, path: '/Cus-profile' },
        { key: 'logout', label: 'ออกจากระบบ', icon: <LogoutOutlined /> }
      );
    } else {
      menu.push(
        { type: 'divider' },
        { key: 'login', label: 'เข้าสู่ระบบ/สมัครสมาชิก', icon: <LoginOutlined />, path: '/login' }
      );
    }
    return menu;
  };

  const handleMenuClick = (info: { key: string }) => {
    onClose();

    if (info.key === 'logout') {
      logout();
      navigate('/buycar'); // เปลี่ยน redirect ไปหน้า buycar
      return;
    }

    const allMenuItems = getMenuItems();
    const selectedItem = allMenuItems.find(item => item && item.key === info.key);

    if (selectedItem && selectedItem.path) {
      navigate(selectedItem.path);
    }
  };

  return (
    <>
        <Header style={{backgroundColor: '#424141ff',
           padding: '0 20px', 
           position: 'sticky',
           top: 0,
           zIndex: 1,
           width: '100%'}}>
        <Row align="middle" justify="space-between" style={{ height: '100%' }}>
          <Col><span style={{ fontSize: '24px', fontWeight: 'bold' ,color : ' #FFD700'}}>SA เต็นท์รถ</span></Col>
          <Col><Button type="text" onClick={showDrawer} icon={<MenuOutlined style={{ fontSize: '24px', color: '#FFD700' }} />} /></Col>
        </Row>
      </Header>
      <Drawer title="เมนู" placement="right" onClose={onClose} open={open} style={{ background: '#262626' }}>
        <Menu mode="inline" items={getMenuItems()} onClick={handleMenuClick} />
      </Drawer>
    </>
  );
};

export default Navbar;