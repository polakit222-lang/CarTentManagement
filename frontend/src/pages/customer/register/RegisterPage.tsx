// src/pages/customer/register/RegisterPage.tsx
import React, { useState } from 'react'; // <-- เพิ่ม useState
import {
  Layout, Button, Row, Col, Card, Form, Input, message, Typography
} from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { mockCustomers } from '../../../data/users';

const { Content } = Layout;
const { Title } = Typography;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  // --- vvvvv --- เพิ่ม state สำหรับจัดการ hover --- vvvvv ---
  const [isHovered, setIsHovered] = useState(false);
  // --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ ---

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    // Check if user already exists
    const existingUser = mockCustomers.find(user => user.email === values.email);
    if (existingUser) {
      message.error('อีเมลนี้มีผู้ใช้งานแล้ว');
      return;
    }

    // Add new user to mock data
    const newUser = {
      id: String(mockCustomers.length + 1),
      ...values,
      role: 'customer'
    };
    mockCustomers.push(newUser);
    
    message.success('สมัครสมาชิกสำเร็จ!');
    navigate('/login');
  };

  return (
    <Layout>
      <Content style={{ padding: '24px 48px' }}>
        <Row justify="center" align="middle" style={{ minHeight: 'calc(100vh - 48px)' }}>
          <Col xs={24} sm={16} md={12} lg={8}>
            <Card style={{ backgroundColor: '#4A4A4A' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ color: 'white' }}>สมัครสมาชิก</Title>
              </div>
              <Form name="register" onFinish={onFinish}>
                <Form.Item name="name" rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}>
                  <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<UserOutlined />} placeholder="ชื่อ" />
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true, message: 'กรุณากรอกอีเมล!' }, { type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง!'}]}>
                  <Input style={{ background: '#424242 ', border: 'grey' }} prefix={<MailOutlined />} placeholder="อีเมล" />
                </Form.Item>
                <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
                  <Input.Password style={{ background: '#424242 ', border: 'grey' }} prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    สมัครสมาชิก
                  </Button>
                </Form.Item>
                <Form.Item>
                  {/* --- vvvvv --- แก้ไขส่วนนี้ --- vvvvv --- */}
                  <Button 
                    type="default" 
                    block 
                    onClick={() => navigate('/login')}
                    onMouseEnter={() => setIsHovered(true)} // เมื่อเมาส์เข้ามา
                    onMouseLeave={() => setIsHovered(false)} // เมื่อเมาส์ออก
                    style={{ 
                      backgroundColor: isHovered ? '#616161' : 'transparent', // เปลี่ยนพื้นหลังเมื่อ hover
                      borderColor: isHovered ? '#616161' : 'white', // เปลี่ยนสีขอบเมื่อ hover (ให้เนียนกับพื้นหลัง)
                      color: isHovered ? 'white' : 'white', // สีข้อความยังคงเป็นสีขาว
                      transition: 'all 0.3s ease-in-out' // เพิ่ม Transition เพื่อให้การเปลี่ยนสีดูนุ่มนวล
                    }}
                  >
                    กลับไปหน้าเข้าสู่ระบบ
                  </Button>
                  {/* --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ --- */}
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default RegisterPage;