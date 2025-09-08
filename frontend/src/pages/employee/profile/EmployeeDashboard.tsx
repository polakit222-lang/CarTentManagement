/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useAuth } from '../../../hooks/useAuth';
import { Button, Spin } from 'antd';

import 'dayjs/locale/th';

// 1. Import Type ที่ถูกต้อง
import type { Employee } from "../../../interface/Employee";
import type { Leave, LeaveType } from "../../../types/leave";

// Components
import "../../../components/EmployeeDashboard/Employeestyle.css";
import PersonalInfoForm from "../../../components/EmployeeDashboard/PersonalInfoForm";
import WorkInfo from "../../../components/EmployeeDashboard/WorkInfo";
import Actions from "../../../components/EmployeeDashboard/Actions";
import LeaveHistory from "../../../components/EmployeeDashboard/LeaveHistory";
import LeaveRequestForm from "../../../components/EmployeeDashboard/LeaveRequestForm";
import Notification from "../../../components/common/Notification";

interface AuthenticatedUser {
    id: number;
    firstName?: string;
}

const EmployeeDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Employee | null>(null);
    const [leaveHistory, setLeaveHistory] = useState<Leave[]>([]);
    const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const { user, token } = useAuth() as { user: AuthenticatedUser | null, token: string | null, logout: () => void };
  

    useEffect(() => {
        // --- vvvvv --- ส่วนที่แก้ไข --- vvvvv ---
        // ดึงข้อมูลพนักงานจาก localStorage
        const data = localStorage.getItem('currentEmployee');
        if (data) {
            try {
                const parsedData: Employee = JSON.parse(data);
                setFormData(parsedData);
                setLoading(false);
            } catch (e) {
                console.error("Failed to parse employee data from localStorage", e);
                setLoading(false);
            }
        } else {
            setLoading(false);
            // ถ้าไม่พบข้อมูลใน localStorage อาจจะ redirect ไปหน้า login
            // navigate('/login');
        }
        // --- ^^^^^ --- จบส่วนที่แก้ไข --- ^^^^^ ---
    }, []); // ให้ useEffect ทำงานแค่ครั้งเดียวตอน mount

    const showNotification = (notif: { type: "success" | "error"; message: string }) => {
        setNotification(notif);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!formData) return;
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleEdit = () => {
        setIsEditing(true);
        setNotification(null);
    };

    const handleSave = async () => {
        if (!formData || !token) return;

        setLoading(true);
        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
            };

            const response = await fetch('http://localhost:8080/employees/me', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                 const errorData = await response.json();
                throw new Error(errorData.error || 'การบันทึกข้อมูลล้มเหลว');
            }

            const result = await response.json();
            setFormData(result.data);
            setIsEditing(false);
            showNotification({ type: "success", message: "บันทึกสำเร็จ!" });

        } catch (error) {
            showNotification({ type: "error", message: (error as Error).message });
        } finally {
            setLoading(false);
        }
    };

    const handleLeaveSubmit = (data: { startDate: string; endDate: string; type: LeaveType }) => {
        const newLeave: Leave = {
            LeaveID: Date.now().toString(),
            ...data,
            status: "approved",
        };
        setLeaveHistory(prev => [...prev, newLeave]);
        showNotification({
            type: "success",
            message: `ส่งคำขอลาเรียบร้อย: ${data.type} ${data.startDate} ถึง ${data.endDate}`,
        });
        setShowLeaveForm(false);
    };

    const mapEmployeeToFormProps = (employee: any) => {
        return {
            ...employee,
            // แปลงชื่อคีย์จาก snake_case เป็น camelCase
            employeeID: employee.id.toString(), 
            firstName: employee.first_name,
            lastName: employee.last_name,
            Phone: employee.phone_number,
            birthday: employee.start_date, // ใช้ start_date เป็น birthday
        };
    };

    if (loading && !formData) {
        return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;
    }

    return (
        <div className="dashboard-container">
            <main className="main-content">
                {notification && <Notification type={notification.type} message={notification.message} />}

                <header className="dashboard-header">
                    <h1>สวัสดี, {formData?.firstName || user?.firstName}</h1>
                    {loading && <Spin />}
                </header>

                <div className="tab-buttons">
                    <button
                        className={activeTab === "profile" ? "active" : ""}
                        onClick={() => setActiveTab("profile")}
                    >
                        ข้อมูลส่วนตัว
                    </button>
                    <button
                        className={activeTab === "leave" ? "active" : ""}
                        onClick={() => setActiveTab("leave")}
                    >
                        ประวัติการลา
                    </button>
                </div>

                {activeTab === "profile" && formData && (
                    <section className="card no-border personal-info-card">
                        <div className="edit-btn-container">
                            {!isEditing ? (
                                <Button onClick={handleEdit} disabled={loading}>แก้ไขข้อมูลของฉัน</Button>
                            ) : (
                                <Button onClick={handleSave} disabled={loading} type="primary">บันทึก</Button>
                            )}
                        </div>

                        <PersonalInfoForm
                            data={mapEmployeeToFormProps(formData)}
                            isEditing={isEditing}
                            onChange={handleChange}
                            errors={{}}
                            showNotification={showNotification}
                        />
                        <WorkInfo
                            position={formData.position}
                            jobType={formData.jobType}
                            totalSales={String(formData.totalSales ?? 'N/A')}
                        />

                        <Actions onLeaveRequest={() => setShowLeaveForm(true)} />
                    </section>
                )}

                {activeTab === "leave" && <LeaveHistory leaves={leaveHistory} />}

                {showLeaveForm && (
                    <LeaveRequestForm
                        onSubmit={handleLeaveSubmit}
                        onCancel={() => setShowLeaveForm(false)}
                        showNotification={showNotification}
                    />
                )}
            </main>
        </div>
    );
};

export default EmployeeDashboard;