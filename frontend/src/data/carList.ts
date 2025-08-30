// src/data/carList.ts
import type { CarInfo } from '../interface/Car';

/**
 * ปรับ yearUsed: เป็นจำนวนปีที่ใช้งาน (years of use)
 * - คำนวณโดยอิงปีปัจจุบัน 2025: usageYears = 2025 - (previous yearUsed)
 *   (ผมแปลงให้เรียบร้อยแล้ว)
 */
export const carList: CarInfo[] = [
  { id: 1, brand: "Toyota", model: "Camry", subModel: "2.5 G", mileage: 80000, price: 750000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 2, brand: "Honda", model: "Civic", subModel: "1.8 EL", mileage: 95000, price: 620000, yearManufactured: 2018, yearUsed: 6, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 3, brand: "Nissan", model: "Almera", subModel: "VL Turbo", mileage: 30000, price: 450000, yearManufactured: 2021, yearUsed: 3, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 4, brand: "Mazda", model: "CX-5", subModel: "2.2 XDL", mileage: 110000, price: 8900000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 5, brand: "Ford", model: "Ranger", subModel: "Wildtrak 4x4", mileage: 140000, price: 720000, yearManufactured: 2016, yearUsed: 8, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 6, brand: "BMW", model: "320d", subModel: "Sport Line", mileage: 60000, price: 1250000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 7, brand: "Mercedes-Benz", model: "C300", subModel: "AMG Dynamic", mileage: 55000, price: 1680000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 8, brand: "Isuzu", model: "D-Max", subModel: "Hi-Lander", mileage: 90000, price: 630000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 9, brand: "MG", model: "ZS", subModel: "1.5 X+", mileage: 35000, price: 480000, yearManufactured: 2021, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 10, brand: "Hyundai", model: "H-1", subModel: "Deluxe", mileage: 100000, price: 980000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 11, brand: "Toyota", model: "Vios", subModel: "Auto", mileage: 2000, price: 300000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["ยังไม่ดำเนินการ"] },
  { id: 12, brand: "Toyota", model: "Vios", subModel: "Auto", mileage: 3000, price: 199999, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["ยังไม่ดำเนินการ"] },

  { id: 13, brand: "Toyota", model: "Fortuner", subModel: "2.8 TRD", mileage: 90000, price: 1380000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 14, brand: "Toyota", model: "Yaris", subModel: "1.2 J", mileage: 25000, price: 320000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 15, brand: "Toyota", model: "Hilux Revo", subModel: "2.4 E", mileage: 110000, price: 550000, yearManufactured: 2016, yearUsed: 8, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 16, brand: "Honda", model: "City", subModel: "1.5 SV", mileage: 42000, price: 520000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 17, brand: "Honda", model: "Jazz", subModel: "1.5 SV", mileage: 60000, price: 380000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 18, brand: "Honda", model: "HR-V", subModel: "1.8 RS", mileage: 30000, price: 720000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 19, brand: "Nissan", model: "X-Trail", subModel: "2.0 V", mileage: 70000, price: 780000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 20, brand: "Nissan", model: "Teana", subModel: "2.0 XL", mileage: 85000, price: 540000, yearManufactured: 2016, yearUsed: 8, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 21, brand: "Nissan", model: "March", subModel: "1.2 E", mileage: 23000, price: 290000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 22, brand: "Mazda", model: "Mazda2", subModel: "1.3 High", mileage: 27000, price: 350000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 23, brand: "Mazda", model: "Mazda3", subModel: "2.0 SP", mileage: 48000, price: 560000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 24, brand: "Mazda", model: "BT-50 Pro", subModel: "4x4", mileage: 120000, price: 640000, yearManufactured: 2016, yearUsed: 8, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 25, brand: "Ford", model: "Everest", subModel: "2.2 Titanium", mileage: 90000, price: 1100000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 26, brand: "Ford", model: "EcoSport", subModel: "1.5 Titanium", mileage: 68000, price: 420000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 27, brand: "Ford", model: "Mustang", subModel: "2.3 EcoBoost", mileage: 45000, price: 2400000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 28, brand: "BMW", model: "X1", subModel: "sDrive18i", mileage: 52000, price: 1580000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 29, brand: "BMW", model: "320i", subModel: "M Sport", mileage: 40000, price: 1350000, yearManufactured: 2018, yearUsed: 7, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 30, brand: "BMW", model: "X3", subModel: "xDrive20d", mileage: 76000, price: 1850000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },

  { id: 31, brand: "Mercedes-Benz", model: "E200", subModel: "Avantgarde", mileage: 63000, price: 1820000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 32, brand: "Mercedes-Benz", model: "GLC 220d", subModel: "4MATIC", mileage: 72000, price: 2200000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },
  { id: 33, brand: "Mercedes-Benz", model: "A200", subModel: "Urban", mileage: 45000, price: 890000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },

  { id: 34, brand: "Isuzu", model: "MU-X", subModel: "3.0 4x4", mileage: 98000, price: 820000, yearManufactured: 2017, yearUsed: 7, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 35, brand: "Isuzu", model: "D-Max", subModel: "Z-Prestige", mileage: 60000, price: 770000, yearManufactured: 2019, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 36, brand: "Isuzu", model: "Spark", subModel: "1.9", mileage: 140000, price: 380000, yearManufactured: 2015, yearUsed: 9, condition: "แย่", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },

  { id: 37, brand: "MG", model: "MG5", subModel: "1.5 Turbo", mileage: 22000, price: 459000, yearManufactured: 2021, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 38, brand: "MG", model: "HS", subModel: "2.0 Turbo", mileage: 48000, price: 798000, yearManufactured: 2019, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 39, brand: "MG", model: "ZS", subModel: "1.5 X+", mileage: 36000, price: 490000, yearManufactured: 2020, yearUsed: 5, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },

  { id: 40, brand: "Hyundai", model: "Tucson", subModel: "2.0 GLS", mileage: 65000, price: 920000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 41, brand: "Hyundai", model: "Kona", subModel: "1.6 Turbo", mileage: 30000, price: 850000, yearManufactured: 2020, yearUsed: 4, condition: "สวย", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] },
  { id: 42, brand: "Hyundai", model: "H-1", subModel: "Premium", mileage: 110000, price: 780000, yearManufactured: 2016, yearUsed: 8, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังให้เช่า"] },

  { id: 43, brand: "Kia", model: "Sportage", subModel: "2.0 LX", mileage: 72000, price: 780000, yearManufactured: 2018, yearUsed: 6, condition: "ปานกลาง", pic: ["https://www.tiscoinsure.com/wp-content/uploads/new-dolphin-frost-white-Stz-z196011367717.webp"], status: ["กำลังขาย"] }
];
 