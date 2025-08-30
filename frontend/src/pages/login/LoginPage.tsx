// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import {
  Layout, Button, Row, Col, Card, Tabs, Form, Input, Checkbox, message, Typography
} from 'antd';
import { UserOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

// --- vvvvv --- นี่คือส่วนที่แก้ไข --- vvvvv ---
// 1. Import "ค่า" (values) ที่จะใช้งานจริง
import { mockCustomers, mockManagers, mockEmployees } from '../../data/users'; 
// 2. Import "ชนิดข้อมูล" (types) ด้วย `import type`
import type { Customer, Manager, Employee } from '../../data/users';
// --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

const { Content } = Layout;
const { Title, Text } = Typography;

interface LoginFormValues {
  email?: string;
  password?: string;
  remember?: boolean;
  employeeId?: string;
  ManagerId?: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [showCustomerPassword, setShowCustomerPassword] = useState(false);
  const [showEmployeePassword, setShowEmployeePassword] = useState(false);
  const [showManagerPassword, setShowManagerPassword] = useState(false);

  const onFinishCustomer = (values: LoginFormValues) => {
    const foundUser: Customer | undefined = mockCustomers.find(
      (user) => user.email === values.email && user.password === values.password
    );

    if (foundUser) {
      message.success('เข้าสู่ระบบสำเร็จ!');
      login(foundUser);
      navigate('/buycar');
    } else {
      message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const onFinishEmployee = (values: LoginFormValues) => {
    const foundEmployee: Employee | undefined = mockEmployees.find(
        (emp) => emp.employeeId === values.employeeId && emp.password === values.password
    );

    if (foundEmployee) {
        message.success('เข้าสู่ระบบสำเร็จ!');
        login(foundEmployee);
        navigate('/homepage-employee');
    } else {
        message.error('รหัสพนักงานหรือรหัสผ่านไม่ถูกต้อง');
    }
  };
  
  const onFinishManager = (values: LoginFormValues) => {
    const foundManager: Manager | undefined = mockManagers.find(
        (mgr) => mgr.ManagerId === values.ManagerId && mgr.password === values.password
    );

    if (foundManager) {
        message.success('เข้าสู่ระบบสำเร็จ!');
        login(foundManager);
        navigate('/home');
    } else {
        message.error('รหัสผู้จัดการหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  const items = [
      {
        key: '1',
        label: 'ลูกค้า',
        children: (
          <Form name="customer_login" onFinish={onFinishCustomer}>
            <Form.Item name="email" rules={[{ required: true, message: 'กรุณากรอกอีเมล!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<UserOutlined />} placeholder="อีเมล" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<LockOutlined />} placeholder="รหัสผ่าน" type={showCustomerPassword ? "text" : "password"} />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={showCustomerPassword} onChange={(e) => setShowCustomerPassword(e.target.checked)} style={{ color: 'white' }}>
                แสดงรหัสผ่าน
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>เข้าสู่ระบบ</Button>
            </Form.Item>
          </Form>
        ),
      },
      {
        key: '2',
        label: 'พนักงาน',
        children: (
          <Form name="employee_login" onFinish={onFinishEmployee}>
            <Form.Item name="employeeId" rules={[{ required: true, message: 'กรุณากรอกรหัสพนักงาน!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<IdcardOutlined />} placeholder="รหัสพนักงาน" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<LockOutlined />} placeholder="รหัสผ่าน" type={showEmployeePassword ? "text" : "password"} />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={showEmployeePassword} onChange={(e) => setShowEmployeePassword(e.target.checked)} style={{ color: 'white' }}>
                แสดงรหัสผ่าน
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>เข้าสู่ระบบ</Button>
            </Form.Item>
          </Form>
        ),
      },
      {
        key: '3',
        label: 'ผู้จัดการ',
        children: (
          <Form name="manager_login" onFinish={onFinishManager}>
            <Form.Item name="ManagerId" rules={[{ required: true, message: 'กรุณากรอกรหัสผู้จัดการ!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<IdcardOutlined />} placeholder="รหัสผู้จัดการ" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
              <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<LockOutlined />} placeholder="รหัสผ่าน" type={showManagerPassword ? "text" : "password"} />
            </Form.Item>
            <Form.Item>
              <Checkbox checked={showManagerPassword} onChange={(e) => setShowManagerPassword(e.target.checked)} style={{ color: 'white' }}>
                แสดงรหัสผ่าน
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>เข้าสู่ระบบ</Button>
            </Form.Item>
          </Form>
        ),
      },
  ];

  return (
    <Layout>
      <Content style={{ padding: '24px 48px' }}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 48px)' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card style={{ backgroundColor: '#4A4A4A' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ color: 'white' }}>SA Car Tent</Title>
                <Text style={{ color: 'white' }}>ลงชื่อเข้าใช้สำหรับลูกค้า, พนักงาน และผู้จัดการ</Text>
              </div>
              <Tabs defaultActiveKey="1" items={items} centered />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default LoginPage;