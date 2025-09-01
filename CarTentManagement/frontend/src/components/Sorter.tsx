import React from 'react';
import { Button, Tooltip } from 'antd';


export type SortOption =
  | 'priceAsc'
  | 'priceDesc'
  | 'mileageAsc'
  | 'mileageDesc'
  | 'condition'
  | 'yearUsedAsc'
  | 'yearUsedDesc';

type Props = {
  value?: SortOption;
  onChange?: (value: SortOption) => void;
};

const Sorter: React.FC<Props> = ({ value, onChange }) => {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <Tooltip title="ราคา: น้อย → มาก">
        <Button
          type={value === 'priceAsc' ? 'primary' : 'default'}
          icon={<img src="/src/assets/pricedown.png" alt="price asc" style={{ width: 18, height: 18 }} />}
          onClick={() => onChange?.('priceAsc')}
        />
      </Tooltip>
      <Tooltip title="ราคา: มาก → น้อย">
        <Button
          type={value === 'priceDesc' ? 'primary' : 'default'}
          icon={<img src="/src/assets/priceup.png" alt="price des" style={{ width: 18, height: 18 }} />}
          onClick={() => onChange?.('priceDesc')}
        />
      </Tooltip>

      <Tooltip title="ไมล์: น้อย → มาก">
        <Button
          type={value === 'mileageAsc' ? 'primary' : 'default'}
          icon={<img src="/src/assets/mile.png" alt="mile asc" style={{ width: 18, height: 18 }} />}
          onClick={() => onChange?.('mileageAsc')}
        />
      </Tooltip>
      <Tooltip title="ไมล์: มาก → น้อย">
        <Button
          type={value === 'mileageDesc' ? 'primary' : 'default'}
          icon={<img src="/src/assets/mileless.png" alt="mile dec" style={{ width: 18, height: 18 }} />}
          onClick={() => onChange?.('mileageDesc')}
        />
      </Tooltip>

      <Tooltip title="สภาพรถ: ดี → แย่">
        <Button
          type={value === 'condition' ? 'primary' : 'default'}
          icon={<img src="/src/assets/car.png" alt="mile dec" style={{ width: 18, height: 18 }} />}
          onClick={() => onChange?.('condition')}
        />
      </Tooltip>
    </div>
  );
};

export default Sorter;