import CarForm from '../../../components/CarForm';
import { useParams, useNavigate } from 'react-router-dom';
import { carList } from '../../../data/carList';
import type { CarInfo } from '../../../interface/Car';

const EditRentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = carList.find(c => c.id === Number(id));

  if (!car) return <div>ไม่พบรถ</div>;

  const handleSubmit = (data: CarInfo) => {
    console.log("แก้ไขรถให้เช่า:", data);
    // TODO: อัปเดตข้อมูลจริง
    navigate('/rent');
  };

  return (
    <div>
      <h2>แก้ไขรถให้เช่า</h2>
      <CarForm initialData={car} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditRentPage;