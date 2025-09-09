// // CreateSellCarPage.tsx
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import type{ SaleList } from '../../../interface/Car';
// import type { CarPicture } from '../../../interface/Car';

// interface CreateSellCarPageProps {
//   saleListID: number;
// }

// const CreateSellCarPage: React.FC<CreateSellCarPageProps> = ({ saleListID }) => {
//   const [saleList, setSaleList] = useState<SaleList | null>(null);
//   const [currentPicIndex, setCurrentPicIndex] = useState(0);
//   const [salePrice, setSalePrice] = useState<number | ''>('');
//   const [employeeID, setEmployeeID] = useState<number | ''>('');
//   const [status, setStatus] = useState('Available');

//   useEffect(() => {
//     axios.get(`/salelists/${saleListID}`).then(res => {
//       setSaleList(res.data);
//       setSalePrice(res.data.sale_price ?? '');
//       setStatus(res.data.status ?? 'Available');
//       setEmployeeID(res.data.employeeID ?? '');
//     }).catch(err => console.error(err));
//   }, [saleListID]);

//   if (!saleList) return <p>Loading...</p>;

//   const pictures: CarPicture[] = saleList.car?.pictures && saleList.car.pictures.length > 0
//     ? saleList.car.pictures
//     : [{ ID: 0, title: 'Default', path: '/images/default_car.jpg', car_id: saleList.car }];

//   const handleNextPic = () => {
//     setCurrentPicIndex((prev) => (prev + 1) % pictures.length);
//   };

//   const handlePrevPic = () => {
//     setCurrentPicIndex((prev) => (prev - 1 + pictures.length) % pictures.length);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     axios.put(`/salelists/${saleListID}`, {
//       sale_price: salePrice,
//       employeeID,
//       status
//     }).then(res => {
//       alert('Updated successfully!');
//       setSaleList(res.data);
//     }).catch(err => console.error(err));
//   };

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', padding: 20, gap: 20 }}>
//       {/* ส่วนบน: Gallery + Form */}
//       <div style={{ display: 'flex', gap: 20 }}>
//         {/* Gallery */}
//         <div style={{ flex: 3, position: 'relative' }}>
//           <img
//             src={pictures[currentPicIndex].path}
//             alt={saleList.car?.car_name}
//             style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
//           />
//           {pictures.length > 1 && (
//             <>
//               <button
//                 onClick={handlePrevPic}
//                 style={{
//                   position: 'absolute', top: '50%', left: 5, transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 35, height: 35, cursor: 'pointer', fontSize: 24
//                 }}
//               >‹</button>
//               <button
//                 onClick={handleNextPic}
//                 style={{
//                   position: 'absolute', top: '50%', right: 5, transform: 'translateY(-50%)',
//                   background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: 35, height: 35, cursor: 'pointer', fontSize: 24
//                 }}
//               >›</button>
//             </>
//           )}
//         </div>

//         {/* Form */}
//         <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 10 }}>
//           <h2>{saleList.car?.car_name}</h2>
//           <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
//             <label>
//               ราคาขาย:
//               <input
//                 type="number"
//                 value={salePrice}
//                 onChange={(e) => setSalePrice(Number(e.target.value))}
//                 style={{ width: '100%' }}
//               />
//             </label>
//             <label>
//               พนักงานผู้ดูแล (ID):
//               <input
//                 type="number"
//                 value={employeeID}
//                 onChange={(e) => setEmployeeID(Number(e.target.value))}
//                 style={{ width: '100%' }}
//               />
//             </label>
//             <label>
//               สถานะ:
//               <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: '100%' }}>
//                 <option value="Available">Available</option>
//                 <option value="Sold">Sold</option>
//                 <option value="Pending">Pending</option>
//               </select>
//             </label>
//             <button type="submit">บันทึก</button>
//           </form>
//         </div>
//       </div>

//       {/* ส่วนล่าง: รายละเอียดรถ */}
//       <div style={{ padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 }}>
//         <h3>รายละเอียดรถ</h3>
//         <p>สี: {saleList.car?.color}</p>
//         <p>ปีที่ผลิต: {saleList.car?.year_manufacture}</p>
//         <p>ระยะทาง: {saleList.car?.mileage?.toLocaleString()} กม.</p>
//         <p>สภาพ: {saleList.car?.condition}</p>
//         {saleList.car?.detail?.Brand && <p>ยี่ห้อ: {saleList.car.detail.Brand.brand_name}</p>}
//         {saleList.car?.detail?.CarModel && <p>รุ่น: {saleList.car.detail.CarModel.ModelName}</p>}
//         {saleList.car?.detail?.SubModel && <p>SubModel: {saleList.car.detail.SubModel.SubModelName}</p>}
//       </div>
//     </div>
//   );
// };

// export default CreateSellCarPage;
