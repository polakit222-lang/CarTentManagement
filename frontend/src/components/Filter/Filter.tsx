import React, { useState, useEffect } from 'react';
import type { CarInfo, FilterValues } from '../../interface/Car';
import { Select, InputNumber, Button, Card, Space, Typography } from 'antd';
import '../../style/Filter.css';

const { Option } = Select;
const { Title } = Typography;

interface FilterProps {
  cars: CarInfo[];
  onApply: (filters: FilterValues) => void;
  onClear: () => void;
}

const Filter: React.FC<FilterProps> = ({ cars, onApply, onClear }) => {
  const [filters, setFilters] = useState<FilterValues>({});
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [subModels, setSubModels] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);

  // Brand + Condition
  useEffect(() => {
    const b: Set<string> = new Set();
    const c: Set<string> = new Set();
    cars.forEach((car) => {
      if (car.car.detail?.Brand?.brand_name) b.add(car.car.detail.Brand.brand_name);
      if (car.car.condition) c.add(car.car.condition);
    });
    setBrands(Array.from(b));
    setConditions(Array.from(c));
  }, [cars]);

  // Model by Brand
  useEffect(() => {
    const m: Set<string> = new Set();
    cars.forEach((car) => {
      if (!filters.brand || car.car.detail?.Brand?.brand_name === filters.brand) {
        if (car.car.detail?.CarModel?.ModelName) m.add(car.car.detail.CarModel.ModelName);
      }
    });
    setModels(Array.from(m));
    setFilters((prev) => ({ ...prev, model: undefined, subModel: undefined }));
  }, [filters.brand, cars]);

  // SubModel by Model
  useEffect(() => {
    const s: Set<string> = new Set();
    cars.forEach((car) => {
      if (!filters.model || car.car.detail?.CarModel?.ModelName === filters.model) {
        if (car.car.detail?.SubModel?.SubModelName) s.add(car.car.detail.SubModel.SubModelName);
      }
    });
    setSubModels(Array.from(s));
    setFilters((prev) => ({ ...prev, subModel: undefined }));
  }, [filters.model, cars]);

  return (
    <div className="filter-sidebar">
      <Card className='filter-card' 
        title={<Title level={4} className='filter-title'>Filter</Title>} bordered={true} >
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* Brand */}
          <div>
            <label>Brand:</label>
            <Select
              allowClear
              placeholder="เลือก Brand"
              value={filters.brand}
              onChange={(v) => setFilters({ ...filters, brand: v })}
              style={{ width: '100%' }}
            >
              {brands.map((b) => (
                <Option key={b} value={b}>{b}</Option>
              ))}
            </Select>
          </div>

          {/* Model */}
          <div>
            <label>Model:</label>
            <Select
              allowClear
              placeholder="เลือก Model"
              value={filters.model}
              onChange={(v) => setFilters({ ...filters, model: v })}
              style={{ width: '100%' }}
            >
              {models.map((m) => (
                <Option key={m} value={m}>{m}</Option>
              ))}
            </Select>
          </div>

          {/* SubModel */}
          <div>
            <label>SubModel:</label>
            <Select
              allowClear
              placeholder="เลือก SubModel"
              value={filters.subModel}
              onChange={(v) => setFilters({ ...filters, subModel: v })}
              style={{ width: '100%' }}
            >
              {subModels.map((s) => (
                <Option key={s} value={s}>{s}</Option>
              ))}
            </Select>
          </div>

          {/* Condition */}
          <div>
            <label>Condition:</label>
            <Select
              allowClear
              placeholder="เลือก Condition"
              value={filters.conditions?.[0]}
              onChange={(v) => setFilters({ ...filters, conditions: v ? [v] : [] })}
              style={{ width: '100%' }}
            >
              {conditions.map((c) => (
                <Option key={c} value={c}>{c}</Option>
              ))}
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label>Price Range:</label>
            
              <InputNumber
                placeholder="Min"
                onChange={(v) =>
                  setFilters({
                    ...filters,
                    priceRange: [typeof v === 'number' ? v : 0, filters.priceRange?.[1] ?? 1000000],
                  })
                }
              />

              <InputNumber
                placeholder="Max"
                onChange={(v) =>
                  setFilters({
                    ...filters,
                    priceRange: [filters.priceRange?.[0] ?? 0, typeof v === 'number' ? v : 1000000],
                  })
                }
              />

              <InputNumber
                placeholder="Mileage"
                onChange={(v) =>
                  setFilters({
                    ...filters,
                    mileageMax: typeof v === 'number' ? v : undefined,
                  })
                }
                style={{ width: '100%' }}
              />

              <Space>
                <InputNumber
                  placeholder="Min"
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      ageRange: [typeof v === 'number' ? v : 0, filters.ageRange?.[1] ?? 100],
                    })
                  }
                />
                <InputNumber
                  placeholder="Max"
                  onChange={(v) =>
                    setFilters({
                      ...filters,
                      ageRange: [filters.ageRange?.[0] ?? 0, typeof v === 'number' ? v : 100],
                    })
                  }
                />
              </Space>

          </div>

          {/* Buttons */}
          <Space>
            <Button type="primary" onClick={() => onApply(filters)}>Apply</Button>
            <Button onClick={() => { setFilters({}); onClear(); }}>Clear</Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Filter;
