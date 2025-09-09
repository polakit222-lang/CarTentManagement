import axios from "axios";
import type { Leave, LeaveStatus, LeaveType } from "../types/leave";

const API = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export async function getLeavesByEmployee(employeeID: string): Promise<Leave[]> {
  const res = await axios.get(`${API}/employees/${employeeID}/leaves`);
  return res.data;
}

export async function createLeave(payload: {
  employeeID: string;
  LeaveID: string;
  startDate: string;
  endDate: string;
  type: LeaveType;
}): Promise<Leave> {
  const res = await axios.post(`${API}/leaves`, payload);
  return res.data;
}

export async function getPendingLeaves(): Promise<Leave[]> {
  const res = await axios.get(`${API}/leaves?status=pending`);
  return res.data;
}

export async function updateLeaveStatus(
  leaveID: string,
  status: LeaveStatus
): Promise<void> {
  await axios.put(`${API}/leaves/${leaveID}/status`, { status });
}
