// 1. แก้ไขค่าใน Type 'Sex' ให้เป็นตัวพิมพ์เล็กทั้งหมด
export type Sex = 'male' | 'female' | 'other';

export interface Employee {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;

  profileImage: string;
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  phoneNumber: string;
  address: string;
  startDate: string;
  
  // 2. ตอนนี้ Type 'sex' จะใช้ค่าที่เป็นตัวพิมพ์เล็กตามที่แก้ไขด้านบน
  sex: Sex;

  position: string;
  jobType: string;
  totalSales: number;
}