/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Typography, Table, Spin, Empty, ConfigProvider, message, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import { FileTextOutlined } from '@ant-design/icons';
import { useAuth } from '../../../hooks/useAuth';

const { Title } = Typography;

interface AuthenticatedUser {
    id: number;
    firstName?: string;
    lastName?: string;
    token: string; // เพิ่ม token เข้ามาในอินเทอร์เฟซ
}

interface DisplaySalesContract {
  id: number;
  contractNumber: string;
  customerName: string;
  employee: string | undefined;
  status?: 'รอดำเนินการ' | 'สำเร็จ' | 'ยกเลิก';
}

const SummaryPage: React.FC = () => {
    const [salesContracts, setSalesContracts] = useState<DisplaySalesContract[]>([]);
    const [loading, setLoading] = useState(true);
    // ดึงทั้ง user และ token จาก useAuth
    const { user, token } = useAuth() as { user: AuthenticatedUser | null, token: string | null };
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalesContracts = async () => {
            if (!user || !user.id || !token) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:8080/sales-contracts/employee/${user.id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // เพิ่มส่วนหัว Authorization
                        'Content-Type': 'application/json'
                    },
                });
                
                if (!response.ok) {
                    throw new Error('ไม่สามารถดึงข้อมูลสัญญาซื้อขายได้');
                }
                const result = await response.json();

                const transformedData: DisplaySalesContract[] = result.data.map((item: any) => ({
                    id: item.ID,
                    contractNumber: `SC-${item.ID}`,
                    customerName: `${item.Customer.FirstName} ${item.Customer.LastName}`,
                    employee: item.Employee.first_name,
                    status: item.status,
                }));

                setSalesContracts(transformedData);
            } catch (error) {
                console.error("Failed to fetch or parse sales contracts", error);
                message.error((error as Error).message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
            } finally {
                setLoading(false);
            }
        };
        fetchSalesContracts();
    }, [user, token]); // เพิ่ม token เข้าไปใน dependency array

    const handleViewDetails = (id: number) => {
      navigate(`/sales-contract-details/${id}`);
    };

    // const getStatusColor = (status: string | undefined) => {
    //     switch (status) {
    //         case 'รอดำเนินการ': return 'orange';
    //         case 'สำเร็จ': return 'green';
    //         case 'ยกเลิก': return 'red';
    //         default: return 'default';
    //     }
    // };

    const columns: TableProps<DisplaySalesContract>['columns'] = [
        {
            title: 'เลขที่สัญญา',
            dataIndex: 'contractNumber',
            key: 'contractNumber',
            render: (text) => (
                <span style={{ color: '#ffffff' }}>
                    <FileTextOutlined style={{ marginRight: 8, color: '#FFD700' }} />
                    {text}
                </span>
            ),
        },
        {
            title: 'ชื่อ-สกุล ลูกค้า',
            dataIndex: 'customerName',
            key: 'customerName',
            sorter: (a, b) => a.customerName.localeCompare(b.customerName),
            render: (text) => (
                <span style={{ color: '#ffffff' }}>{text}</span>
            )
        },
        // {
        //     title: 'สถานะ',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (status) => (
        //         <Tag color={getStatusColor(status)}>
        //             {(status || 'N/A').toUpperCase()}
        //         </Tag>
        //     ),
        // },
        {
            title: 'จัดการ',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#FFD700', borderColor: '#FFD700', color: '#121212', fontWeight: 500 }}
                        onClick={() => handleViewDetails(record.id)}
                    >
                        ดูรายละเอียด
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <ConfigProvider
            theme={{
                components: {
                    Table: { colorBgContainer: '#1e1e1e', headerBg: '#b38e2f', headerColor: '#121212', colorBorderSecondary: '#FFD700', rowHoverBg: '#2a2a2a', colorText: '#ffffff', headerSortActiveBg: '#FFD700', headerSortHoverBg: '#FFD700' },
                    Spin: { colorPrimary: '#FFD700' },
                    Empty: { colorText: '#777' },
                    Button: { defaultBg: '#1e1e1e', defaultColor: '#ffffff', defaultBorderColor: '#FFD700', defaultHoverBg: '#b38e2f', defaultHoverColor: '#121212', defaultHoverBorderColor: '#FFD700' },
                    Tag: { colorText: '#121212' }
                },
            }}
        >
            <div style={{ padding: '24px', background: '#121212', minHeight: '100vh', marginTop: '40px' }}>
                <Title level={2} style={{ color: '#FFD700' }}>
                    สัญญาซื้อที่ฉันดูแล
                </Title>
                <Spin spinning={loading} size="large">
                    <Table
                        columns={columns}
                        dataSource={salesContracts}
                        rowKey="id"
                        pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total, range) => `${range[0]}-${range[1]} จาก ${total} รายการ` }}
                        locale={{ emptyText: <Empty description={<Typography.Text style={{ color: '#777' }}>{'ไม่มีข้อมูลสัญญาซื้อขายที่ตรงกับเงื่อนไข'}</Typography.Text>} /> }}
                    />
                </Spin>
            </div>
        </ConfigProvider>
    );
};

export default SummaryPage;