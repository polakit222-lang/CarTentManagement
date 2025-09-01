import React, { useState, useEffect } from "react";
import "../../../components/EmployeeDashboard/Employeestyle.css";
//import Sidebar from "../components/EmployeeDashboard/Sidebar";
import Sidebar from "../../../components/EmployeeDashboard/Sidebar";
//import PersonalInfoForm from "../components/EmployeeDashboard/PersonalInfoForm";
import PersonalInfoForm from "../../../components/EmployeeDashboard/PersonalInfoForm";
import WorkInfo from "../../../components/EmployeeDashboard/WorkInfo";
import Actions from "../../../components/EmployeeDashboard/Actions";
import LeaveHistory from "../../../components/EmployeeDashboard/LeaveHistory";
import LeaveRequestForm from "../../../components/EmployeeDashboard/LeaveRequestForm";
import Notification from "../../../components/common/Notification";
import { fetchEmployee, updateEmployee } from "../../../services/employeeService";
import { validateAll } from "../../../utils/validation";
import type { Employee } from "../../../types/employee";
import type { Leave, LeaveType } from "../../../types/leave";

const EmployeeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Employee | null>(null);
  const [errors, setErrors] = useState<Partial<Record<keyof Employee, string>>>({});
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showLeaveForm, setShowLeaveForm] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState<Leave[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchEmployee()
      .then(data => setFormData(data))
      .catch(() => showNotification({ type: "error", message: "เกิดข้อผิดพลาดในการโหลดข้อมูล" }))
      .finally(() => setLoading(false));
  }, []);

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
    if (!formData) return;
    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showNotification({ type: "error", message: "กรุณาตรวจสอบฟิลด์ที่ระบุ" });
      return;
    }

    try {
      setLoading(true);
      const updated = await updateEmployee(formData);
      setFormData(updated);
      setIsEditing(false);
      setErrors({});
      showNotification({ type: "success", message: "บันทึกสำเร็จ!" });
    } catch {
      showNotification({ type: "error", message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" });
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
  showNotification({ type: "success", message: `ส่งคำขอลาเรียบร้อย: ${data.type} ${data.startDate} ถึง ${data.endDate}` });
  setShowLeaveForm(false);
};

  return (
    <div className="dashboard-container">
      <Sidebar onSelect={setActiveTab} activeTab={activeTab} />

      <main className="main-content">
        {notification && <Notification type={notification.type} message={notification.message} />}

        <header className="dashboard-header">
          <h1>สวัสดี, {formData?.firstName || "ผู้ใช้งาน"}</h1>
          {loading && <span>กำลังโหลด...</span>}
        </header>

        {activeTab === "profile" && formData && (
          <section className="card no-border personal-info-card">
            <div className="edit-btn-container">
              {!isEditing ? (
                <button onClick={handleEdit} disabled={loading}>แก้ไขข้อมูลของฉัน</button>
              ) : (
                <button onClick={handleSave} disabled={loading}>บันทึก</button>
              )}
            </div>

            <PersonalInfoForm data={formData} isEditing={isEditing} onChange={handleChange} errors={errors} showNotification={showNotification} />
            <WorkInfo position={formData.position} jobType={formData.jobType} totalSales={formData.totalSales} />
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
