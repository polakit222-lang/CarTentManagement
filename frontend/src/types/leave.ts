export type LeaveStatus = "pending" | "approved" | "denied";
export type LeaveType = "ลาป่วย" | "ลากิจ" | "ลาพักร้อน";

export interface Leave {
  leaveID: string;       // <- เปลี่ยนเป็น camelCase ให้ตรง backend
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: LeaveStatus;
}
