import { useState } from 'react';
import type { CarInfo } from '../interface/Car';

interface CarFormProps {
  initialData?: CarInfo;
  onSubmit: (data: CarInfo) => void;
}

const CarForm: React.FC<CarFormProps> = ({ initialData, onSubmit }) => {
  const [formData, setFormData] = useState<CarInfo>(
    initialData || {
      id: Date.now(),
      brand: '',
      model: '',
      subModel: '',
      mileage: 0,
      price: 0,
      yearManufactured: new Date().getFullYear(),
      yearUsed: new Date().getFullYear(),
      condition: '',
      pic: [],
      status: []
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' || name === 'mileage' ? Number(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <input name="brand" value={formData.brand} onChange={handleChange} placeholder="ยี่ห้อ" />
      <input name="model" value={formData.model} onChange={handleChange} placeholder="รุ่น" />
      <input name="subModel" value={formData.subModel} onChange={handleChange} placeholder="รุ่นย่อย" />
      <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="ราคา" />
      <input name="mileage" type="number" value={formData.mileage} onChange={handleChange} placeholder="เลขไมล์" />
      <button type="submit">บันทึก</button>
    </form>
  );
};

export default CarForm;