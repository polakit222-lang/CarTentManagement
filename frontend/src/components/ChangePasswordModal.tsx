import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { LockOutlined } from '@ant-design/icons';

interface ChangePasswordModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ visible, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  // --- vvvvv --- เพิ่ม state สำหรับจัดการสถานะของช่องรหัสผ่านปัจจุบัน --- vvvvv ---
  const [currentPasswordStatus, setCurrentPasswordStatus] = useState<{
    status: '' | 'success' | 'error';
    help: string | null;
  }>({ status: '', help: null });
  // --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ ---

  // --- vvvvv --- เพิ่มฟังก์ชันสำหรับตรวจสอบรหัสผ่านปัจจุบันทันทีที่พิมพ์ --- vvvvv ---
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!value) {
      // ถ้าช่องว่าง ให้เคลียร์สถานะ
      setCurrentPasswordStatus({ status: '', help: null });
      return;
    }

    const currentUserData = localStorage.getItem('currentCustomer');
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      if (currentUser.Password === value) {
        // ถ้ารหัสผ่านถูกต้อง
        setCurrentPasswordStatus({ status: 'success', help: 'รหัสผ่านถูกต้อง' });
      } else {
        // ถ้ารหัสผ่านไม่ถูกต้อง
        setCurrentPasswordStatus({ status: 'error', help: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      }
    }
  };
  // --- ^^^^^ --- จบส่วนที่เพิ่ม --- ^^^^^ ---

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinish = (values: any) => {
    // 1. ดึงข้อมูลผู้ใช้ที่ล็อกอินอยู่
    const currentUserData = localStorage.getItem('currentCustomer');
    if (!currentUserData) {
      message.error('ไม่พบข้อมูลผู้ใช้ที่ล็อกอินอยู่');
      return;
    }
    const currentUser = JSON.parse(currentUserData);

    // 2. ตรวจสอบรหัสผ่านปัจจุบันอีกครั้งก่อนบันทึก
    if (currentUser.Password !== values.currentPassword) {
      message.error('รหัสผ่านปัจจุบันไม่ถูกต้อง!');
      setCurrentPasswordStatus({ status: 'error', help: 'รหัสผ่านปัจจุบันไม่ถูกต้อง' });
      return;
    }

    // 3. อัปเดตรหัสผ่านใหม่
    const updatedCurrentUser = { ...currentUser, Password: values.newPassword };
    localStorage.setItem('currentCustomer', JSON.stringify(updatedCurrentUser));

    // 4. อัปเดตข้อมูลรหัสผ่านในรายการลูกค้าทั้งหมดด้วย
    const allCustomersData = localStorage.getItem('customerData');
    if (allCustomersData) {
      let allCustomers = JSON.parse(allCustomersData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      allCustomers = allCustomers.map((cust: any) =>
        cust.id === currentUser.id ? updatedCurrentUser : cust
      );
      localStorage.setItem('customerData', JSON.stringify(allCustomers));
    }
    
    message.success('เปลี่ยนรหัสผ่านสำเร็จ!');
    form.resetFields();
    onSuccess();
  };

  // ฟังก์ชันที่ทำงานเมื่อปิด Modal
  const handleCancel = () => {
    form.resetFields();
    setCurrentPasswordStatus({ status: '', help: null }); // รีเซ็ตสถานะเมื่อปิด
    onCancel();
  };


  return (
    <Modal title="เปลี่ยนรหัสผ่าน" open={visible} onCancel={handleCancel} destroyOnClose footer={null}>
      <Form form={form} name="change_password" onFinish={onFinish} layout="vertical" style={{marginTop: '24px'}}>
        
        {/* --- vvvvv --- แก้ไข Form.Item ของรหัสผ่านปัจจุบัน --- vvvvv --- */}
        <Form.Item
          name="currentPassword"
          label="รหัสผ่านปัจจุบัน"
          rules={[{ required: true, message: 'กรุณากรอกรหัสผ่านปัจจุบัน!' }]}
          validateStatus={currentPasswordStatus.status}
          help={currentPasswordStatus.help}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="รหัสผ่านปัจจุบัน"
            onChange={handleCurrentPasswordChange}
          />
        </Form.Item>
        {/* --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ --- */}

        <Form.Item
          name="newPassword"
          label="รหัสผ่านใหม่"
          rules={[
            { required: true, message: 'กรุณากรอกรหัสผ่านใหม่!' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                if (value.length < 5) return Promise.reject(new Error('รหัสผ่านต้องมีความยาวอย่างน้อย 5 ตัวอักษร!'));
                if (!/[a-zA-Z]/.test(value) || !/[0-9]/.test(value)) return Promise.reject(new Error('รหัสผ่านต้องมีตัวอักษรและตัวเลขผสมกัน!'));
                return Promise.resolve();
              },
            },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="รหัสผ่านใหม่" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="ยืนยันรหัสผ่านใหม่"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: 'กรุณายืนยันรหัสผ่านใหม่!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('รหัสผ่านใหม่ที่คุณกรอกไม่ตรงกัน!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="ยืนยันรหัสผ่านใหม่" />
        </Form.Item>

        <Form.Item style={{marginTop: '16px'}}>
          <Button type="primary" htmlType="submit" block>
            บันทึกรหัสผ่านใหม่
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;