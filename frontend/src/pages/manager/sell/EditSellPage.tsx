import CarForm from '../../../components/CarForm';
import { useParams, useNavigate } from 'react-router-dom';
import { carList } from '../../../data/carList';

const EditSellPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const car = carList.find(c => c.id === Number(id));

  if (!car) return <div>ไม่พบรถ</div>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any) => {
    console.log("แก้ไขรถขาย:", data);
    navigate('/sell');
  };

  return (
    <div>
      <h2>แก้ไขรถขาย</h2>
      <CarForm initialData={car} onSubmit={handleSubmit} />
    </div>
  );
};

export default EditSellPage;