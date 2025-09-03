import type { Employee } from "../types/employee";

export const validateAll = (data: Employee) => {
  const errors: Partial<Record<keyof Employee, string>> = {};

  if (!data.firstName) errors.firstName = "กรุณากรอกชื่อ";
  if (!data.lastName) errors.lastName = "กรุณากรอกนามสกุล";

  if (!data.email) errors.email = "กรุณากรอกอีเมล";
  else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = "รูปแบบอีเมลไม่ถูกต้อง";

  if (!data.phone) errors.phone = "กรุณากรอกเบอร์โทร";
  else if (!/^(\+66|0)[0-9]{8,9}$/.test(data.phone)) errors.phone = "เบอร์โทรไม่ถูกต้อง";

  if (!data.address) errors.address = "กรุณากรอกที่อยู่";
  if (!data.birthday) errors.birthday = "กรุณากรอกวันเกิด";
  if (!data.position) errors.position = "กรุณากรอกตำแหน่ง";
  if (!data.jobType) errors.jobType = "กรุณากรอกประเภทงาน";

  if (!data.totalSales) errors.totalSales = "กรุณากรอกยอดขาย";
  else if (isNaN(Number(data.totalSales))) errors.totalSales = "ยอดขายต้องเป็นตัวเลข";

  return errors;
};
