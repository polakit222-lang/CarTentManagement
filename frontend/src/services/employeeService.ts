import type { Employee } from "../types/employee";

export const mockEmployeeData: Employee = {
  employeeID: "001",
  profileImage: "",
  firstName: "Ponlakit",
  lastName: "S.",
  email: "ponlakit@example.com",
  phone: "0812345678",
  address: "Nakhon Ratchasima, Thailand",
  sex: "male",
  birthday: "1995-08-20",
  position: "Frontend Developer",
  jobType: "Full-time",
  totalSales: "120000",
};

export const fetchEmployee = async (): Promise<Employee> => {
  await new Promise(res => setTimeout(res, 500));
  return mockEmployeeData;
};

export const updateEmployee = async (data: Employee): Promise<Employee> => {
  await new Promise(res => setTimeout(res, 500));
  return data;
};
