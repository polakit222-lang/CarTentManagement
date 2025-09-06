import React, { useState, useEffect } from 'react';
import {
  Card, Avatar, Descriptions, Button, Row, Col, Typography, message,
  Form, Input, DatePicker
} from 'antd';
import { 
  UserOutlined, EditOutlined, LockOutlined, MailOutlined, PhoneOutlined, 
  SaveOutlined, CloseCircleOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import locale from 'antd/es/date-picker/locale/th_TH';
import 'dayjs/locale/th';
import ChangePasswordModal from '../../../components/ChangePasswordModal';

interface Customer {
  id: number;
  FirstName: string;
  LastName: string;
  Email: string;
  Phone: string;
  Birthday: string;
  Password?: string;
}

const CusProfilePage: React.FC = () => {
  const [customerData, setCustomerData] = useState<Customer | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('currentCustomer');
    if (data) {
      const parsedData = JSON.parse(data);
      setCustomerData(parsedData);
      form.setFieldsValue({
        ...parsedData,
        Birthday: parsedData.Birthday ? dayjs(parsedData.Birthday) : null,
      });
    }
  }, [form]);

  // ฟังก์ชันสำหรับอัปเดตข้อมูลใน customerData array หลัก
  const updateMainCustomerList = (updatedCustomer: Customer) => {
    const allCustomersData = localStorage.getItem('customerData');
    if (allCustomersData) {
      let allCustomers = JSON.parse(allCustomersData);
      allCustomers = allCustomers.map((cust: Customer) => 
        cust.id === updatedCustomer.id ? updatedCustomer : cust
      );
      localStorage.setItem('customerData', JSON.stringify(allCustomers));
    }
  };
  
  const handleEdit = () => setIsEditMode(true);
  
  const handleCancel = () => {
    if (customerData) {
      form.setFieldsValue({
        ...customerData,
        Birthday: customerData.Birthday ? dayjs(customerData.Birthday) : null,
      });
    }
    setIsEditMode(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishEdit = (values: any) => {
    if (!customerData) return;
    const updatedData: Customer = {
      ...customerData,
      FirstName: values.FirstName,
      LastName: values.LastName,
      Email: values.Email,
      Phone: values.Phone,
      Birthday: values.Birthday.toISOString(),
    };
    
    localStorage.setItem('currentCustomer', JSON.stringify(updatedData));
    updateMainCustomerList(updatedData); // อัปเดตข้อมูลใน Array หลัก
    
    setCustomerData(updatedData);
    setIsEditMode(false);
    message.success('บันทึกข้อมูลสำเร็จ!');
  };

  const customInputStyle = { backgroundColor: '#363636', color: 'white', borderColor: '#f1d846ff' };
  const customCardStyle: React.CSSProperties = { backgroundColor: '#363636', color: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)', border: '1px solid #f1d846ff' };

  if (!customerData) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <Typography.Title level={2} style={{color: 'white'}}>ไม่พบข้อมูลผู้ใช้</Typography.Title>
        <Typography.Text style={{color: 'white'}}>กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</Typography.Text>
        <br />
        <Button style={{ marginTop: '20px', background: 'linear-gradient(45deg, #FFD700, #FFA500)', color: 'black', border: 'none' }} onClick={() => navigate('/login')}>
          กลับไปหน้าเข้าสู่ระบบ
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 48px' }}>
      <Typography.Title level={2} style={{ color: ' #FFD700', marginBottom: 24 }}>
        {isEditMode ? "แก้ไขข้อมูลส่วนตัว" : "ข้อมูลของฉัน"}
      </Typography.Title>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={14}>
          <Card style={customCardStyle}>
            <Row gutter={[32, 24]} align="top">
              <Col xs={24} md={8} style={{ textAlign: 'center' }}>
                <Avatar size={128} icon={<UserOutlined />} style={{ backgroundColor: '#f1d430ff', color: 'black' }}/>
                <h2 style={{ marginTop: '16px', color: 'white' }}>{`${customerData.FirstName} ${customerData.LastName}`}</h2>
              </Col>
              <Col xs={24} md={16}>
                {isEditMode ? (
                  <Form form={form} layout="vertical" onFinish={onFinishEdit}>
                     <Form.Item
        name="FirstName"
        label={<span style={{ color: '#aaaaaa' }}>ชื่อจริง</span>}
        rules={[
          { required: true, message: 'กรุณากรอกชื่อจริง' },
          {
            validator: (_, value) => {
              if (!value || /^[a-zA-Zก-๙\s]+$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('กรุณากรอกเฉพาะตัวอักษรเท่านั้น!'));
            }
          }
        ]}
      >
        <Input prefix={<UserOutlined />} style={customInputStyle} />
      </Form.Item>
      <Form.Item
        name="LastName"
        label={<span style={{ color: '#aaaaaa' }}>นามสกุล</span>}
        rules={[
          { required: true, message: 'กรุณากรอกนามสกุล' },
          {
            validator: (_, value) => {
              if (!value || /^[a-zA-Zก-๙\s]+$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('กรุณากรอกเฉพาะตัวอักษรเท่านั้น!'));
            }
          }
        ]}
      >
        <Input prefix={<UserOutlined />} style={customInputStyle} />
      </Form.Item>
      <Form.Item
        name="Email"
        label={<span style={{ color: '#aaaaaa' }}>อีเมล</span>}
        rules={[{ required: true, type: 'email', message: 'รูปแบบอีเมลไม่ถูกต้อง' }]}
      >
        <Input prefix={<MailOutlined />} style={customInputStyle} />
      </Form.Item>
      <Form.Item
        name="Phone"
        label={<span style={{ color: '#aaaaaa' }}>เบอร์โทรศัพท์</span>}
        rules={[
          { required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' },
          {
            validator: (_, value) => {
              if (!value || /^\d{10}$/.test(value)) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('กรุณากรอกเบอร์โทรศัพท์ 10 หลักให้ถูกต้อง!'));
            }
          }
        ]}
      >
        <Input prefix={<PhoneOutlined />} style={customInputStyle} />
      </Form.Item>
      {/* --- ^^^^^ --- จบส่วนที่อัปเดต --- ^^^^^ --- */}
      <Form.Item name="Birthday" label={<span style={{color: '#aaaaaa'}}>วันเกิด</span>}><DatePicker locale={locale} format="DD MMMM BBBB" style={{ width: '100%', ...customInputStyle }} /></Form.Item>
                  </Form>
                ) : (
                  <Descriptions bordered column={1} size="middle" labelStyle={{backgroundColor: '#4a4a4a', color: '#aaaaaa', borderColor: '#555'}} contentStyle={{backgroundColor: '#363636', color: 'white', borderColor: '#555'}}>
                    <Descriptions.Item label="ชื่อจริง">{customerData.FirstName}</Descriptions.Item>
                    <Descriptions.Item label="นามสกุล">{customerData.LastName}</Descriptions.Item>
                    <Descriptions.Item label="อีเมล">{customerData.Email}</Descriptions.Item>
                    <Descriptions.Item label="เบอร์โทรศัพท์">{customerData.Phone}</Descriptions.Item>
                    <Descriptions.Item label="วันเกิด">{new Date(customerData.Birthday).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</Descriptions.Item>
                  </Descriptions>
                )}
              </Col>
            </Row>
            <Row justify="end" style={{ marginTop: '32px' }} gutter={16}>
              {isEditMode ? (
                <>
                  <Col><Button icon={<CloseCircleOutlined />} onClick={handleCancel} danger>ยกเลิก</Button></Col>
                  <Col><Button type="primary" icon={<SaveOutlined />} onClick={() => form.submit()} style={{ background: '#f1d430ff', color: 'black', border: 'none' }}>บันทึกข้อมูล</Button></Col>
                </>
              ) : (
                <>
                  <Col><Button onClick={() => setIsModalVisible(true)} icon={<LockOutlined />}>เปลี่ยนรหัสผ่าน</Button></Col>
                  <Col><Button type="primary" icon={<EditOutlined />} onClick={handleEdit} style={{ background: '#f1d430ff', color: 'black', border: 'none' }}>แก้ไขข้อมูล</Button></Col>
                </>
              )}
            </Row>
          </Card>
        </Col>
      </Row>
      <ChangePasswordModal visible={isModalVisible} onCancel={() => setIsModalVisible(false)} onSuccess={() => setIsModalVisible(false)}/>
    </div>
  );
};

export default CusProfilePage;