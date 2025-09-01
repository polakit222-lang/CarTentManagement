export type LeaveStatus = "pending" | "approved" | "denied";
export type LeaveType = "ลาป่วย" | "ลากิจ" | "ลาพักร้อน";
export interface Leave {
  LeaveID: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
  status: LeaveStatus;
}
