import type { CarInfo } from '../interface/Car';
import CarCard from './CarCard';
import { Link } from 'react-router-dom';

interface CarGridProps {
  cars: CarInfo[];
  editBasePath?: string;
  addBasePath?: string;
  deleteBasePath?: string;
  rentBasePath?: string;
  sellBasePath?: string;

  detailBasePath?: string;
}

const CarGrid: React.FC<CarGridProps> = ({
  cars,
  editBasePath,
  addBasePath,
  deleteBasePath,
  rentBasePath,
  sellBasePath,

  detailBasePath,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
        gap: '30px',
        padding: '20px',
        width: '100%',
      }}
    >

      {cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          editPath={editBasePath ? `${editBasePath}/${car.id}` : undefined}
          deletePath={deleteBasePath ? `${deleteBasePath}/${car.id}` : undefined}
          rentPath={rentBasePath ? `${rentBasePath}/${car.id}` : undefined}
          sellPath={sellBasePath ? `${sellBasePath}/${car.id}` : undefined}

          detailPath={detailBasePath ? `${detailBasePath}/${car.id}` : undefined}
        />
      ))}
      {addBasePath && (
        <Link
          to={addBasePath}
          style={{
            border: '2px dashed #999',
            borderRadius: 8,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            minHeight: 300,
            width: 450,

          }}
        >
          เพิ่มรายการ➕
        </Link>

      )}
    </div>

  );
};

export default CarGrid;