// frontend/src/pages/customer/register/RegisterPage.tsx

import React from 'react';
import { Form, Input, Button, DatePicker, Row, Col, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import 'dayjs/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';

const { Title } = Typography;

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onFinish = async (values: any) => {
        console.log('Received values of form: ', values);

        // Corrected payload to match backend's RegisterInput struct
        const payload = {
            first_name: values.firstName, // Use snake_case
            last_name: values.lastName,   // Use snake_case
            email: values.email,
            password: values.password,
            phone: values.phoneNumber,
            birthday: values.dateOfBirth.format('YYYY-MM-DD'), // ส่งเป็น string ในรูปแบบที่เข้าใจง่าย
        };

        try {
            const response = await fetch('http://localhost:8080/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                message.success('ลงทะเบียนสำเร็จ! โปรดเข้าสู่ระบบ');
                navigate('/login');
            } else {
                const errorData = await response.json();
                message.error(`ลงทะเบียนไม่สำเร็จ: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Registration failed:', error);
            message.error('การเชื่อมต่อล้มเหลว โปรดลองอีกครั้ง');
        }
    };

    return (
        <div style={{ background: '#222', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Row justify="center" align="middle" style={{ width: '100%' }}>
                <Col xs={24} sm={20} md={16} lg={12} xl={8}>
                    <div style={{ padding: '20px', background: '#333', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' }}>
                        <Title level={2} style={{ textAlign: 'center', color: '#FFD700', marginBottom: '24px' }}>ลงทะเบียน</Title>
                        <Form
                            form={form}
                            name="register"
                            onFinish={onFinish}
                            layout="vertical"
                            autoComplete="off"
                            style={{ color: 'white' }}
                        >
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name="firstName"
                                        label={<span style={{ color: 'white' }}>ชื่อ</span>}
                                        rules={[{ required: true, message: 'กรุณากรอกชื่อ!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="lastName"
                                        label={<span style={{ color: 'white' }}>นามสกุล</span>}
                                        rules={[{ required: true, message: 'กรุณากรอกนามสกุล!' }]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="email"
                                label={<span style={{ color: 'white' }}>อีเมล</span>}
                                rules={[{ required: true, type: 'email', message: 'กรุณากรอกอีเมลที่ถูกต้อง!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="password"
                                label={<span style={{ color: 'white' }}>รหัสผ่าน</span>}
                                rules={[{ required: true, message: 'กรุณากรอกรหัสผ่าน!' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="confirmPassword"
                                label={<span style={{ color: 'white' }}>ยืนยันรหัสผ่าน</span>}
                                dependencies={['password']}
                                hasFeedback
                                rules={[
                                    { required: true, message: 'กรุณายืนยันรหัสผ่าน!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('รหัสผ่านไม่ตรงกัน!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                name="phoneNumber"
                                label={<span style={{ color: 'white' }}>เบอร์โทรศัพท์</span>}
                                rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="dateOfBirth"
                                label={<span style={{ color: 'white' }}>วันเกิด</span>}
                                rules={[{ required: true, message: 'กรุณาเลือกวันเกิด!' }]}
                            >
                                <DatePicker style={{ width: '100%' }} locale={locale} />
                            </Form.Item>
                            
                            <Form.Item>
                                <Button type="primary" htmlType="submit" style={{ width: '100%', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none', fontWeight: 'bold' }}>
                                    ลงทะเบียน
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RegisterPage;