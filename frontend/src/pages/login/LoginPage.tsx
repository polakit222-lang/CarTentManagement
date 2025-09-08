// src/pages/login/LoginPage.tsx
import React, { useState } from 'react';
import {
    Layout, Button, Row, Col, Card, Tabs, Form, Input, Checkbox, message, Typography
} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const { Content } = Layout;
const { Title, Text, Link } = Typography;

interface LoginFormValues {
    email?: string;
    password?: string;
    remember?: boolean;
}

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [activeTabKey, setActiveTabKey] = useState('1');

    /**
     * Handles Customer Login
     */
    const onFinishCustomer = async (values: LoginFormValues) => {
        const payload = {
            email: values.email,
            password: values.password,
        };
        try {
            const response = await fetch('http://localhost:8080/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.customer, data.token);
                message.success('เข้าสู่ระบบสำเร็จ!');
                navigate('/buycar');
            } else {
                message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            console.error("Login failed:", error);
            message.error("การเชื่อมต่อล้มเหลว");
        }
    };

    /**
     * Handles Employee Login
     */
    const onFinishEmployee = async (values: LoginFormValues) => {
        const payload = {
            email: values.email,
            password: values.password,
        };
        try {
            const response = await fetch('http://localhost:8080/employee/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                
                // --- vvvvv --- ส่วนที่แก้ไข (สำคัญที่สุด) --- vvvvv ---
                // 1. สร้าง Object ข้อมูลพนักงานให้สมบูรณ์ตามที่ AuthProvider ต้องการ
                const employeeData = {
                    ...data.employee, // ข้อมูลเดิม: ID, email, firstName, lastName
                    name: `${data.employee.firstName} ${data.employee.lastName}`, // เพิ่ม 'name' สำหรับแสดงผล
                    position: data.employee.Position || 'Employee', // เพิ่ม 'position' เพื่อให้ isEmployee() ทำงานถูกต้อง
                };

                // 2. เรียกใช้ฟังก์ชัน login ด้วยข้อมูลที่ปรับปรุงแล้ว
                login(employeeData, data.token);
                
                // 3. แสดงข้อความและนำทางไปยังหน้า homepage
                message.success('เข้าสู่ระบบพนักงานสำเร็จ!');
                navigate('/homepage-employee');
                // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---

            } else {
                message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            console.error("Login failed:", error);
            message.error("การเชื่อมต่อล้มเหลว");
        }
    };

    /**
     * Handles Manager Login
     */
    const onFinishManager = async (values: LoginFormValues) => {
        const payload = {
            email: values.email,
            password: values.password,
        };
        try {
            const response = await fetch('http://localhost:8080/manager/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                login(data.manager, data.token);
                message.success('เข้าสู่ระบบสำเร็จ!');
                navigate('/home'); // Manager's home
            } else {
                message.error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
            }
        } catch (error) {
            console.error("Login failed:", error);
            message.error("การเชื่อมต่อล้มเหลว");
        }
    };


    const items = [
        {
            key: '1',
            label: 'ลูกค้า',
            children: (
                <Form name="customer_login" onFinish={onFinishCustomer} initialValues={{ remember: true }}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'กรุณากรอกอีเมลที่ถูกต้อง!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="อีเมล" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>จดจำฉัน</Checkbox>
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
                <Form name="employee_login" onFinish={onFinishEmployee} initialValues={{ remember: true }}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'กรุณากรอกอีเมล!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="อีเมล" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>จดจำฉัน</Checkbox>
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
                <Form name="manager_login" onFinish={onFinishManager} initialValues={{ remember: true }}>
                    <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'กรุณากรอกอีเมล!' }]}>
                        <Input prefix={<UserOutlined />} placeholder="อีเมล" />
                    </Form.Item>
                    <Form.Item name="password" rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}>
                        <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่าน" />
                    </Form.Item>
                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>จดจำฉัน</Checkbox>
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
            <Content style={{ padding: '24px 48px', background: '#222', minHeight: '100vh' }}>
                <Row justify="center" align="middle" style={{ height: '100%' }}>
                    <Col xs={24} sm={16} md={12} lg={8}>
                        <Card style={{ backgroundColor: '#333', border: '1px solid #444' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <Title level={2} style={{ color: '#FFD700' }}>SA Car Tent</Title>
                                <Text style={{ color: '#ccc' }}>เข้าสู่ระบบสำหรับลูกค้าและทีมงาน</Text>
                            </div>

                            <Tabs
                                activeKey={activeTabKey}
                                items={items}
                                centered
                                onChange={(key) => setActiveTabKey(key)}
                                className="login-tabs"
                            />

                            {activeTabKey === '1' && (
                                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                    <Text style={{ color: '#ccc' }}>ยังไม่มีบัญชี? </Text>
                                    <Link onClick={() => navigate('/register')} style={{ color: '#1677ff' }}>
                                        สมัครสมาชิกที่นี่
                                    </Link>
                                </div>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Content>
            <style>{`
                .login-tabs .ant-tabs-tab {
                    color: #ccc;
                }
                .login-tabs .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
                    color: #FFD700;
                }
                .login-tabs .ant-tabs-ink-bar {
                    background: #FFD700;
                }
            `}</style>
        </Layout>
    );
};

export default LoginPage;

