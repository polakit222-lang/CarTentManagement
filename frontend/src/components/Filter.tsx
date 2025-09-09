import React, { useState } from "react";
import type { CarInfo, FilterValues, SortOption } from "../interface/Car";
import { Select, Button, Card, Space, Typography } from "antd";
import "../style/Filter.css";

const { Option } = Select;
const { Title } = Typography;

interface FilterProps {
  cars: CarInfo[];
  onApply: (filters: FilterValues, sort?: SortOption) => void;
  onClear: () => void;
}

const Filter: React.FC<FilterProps> = ({ cars, onApply, onClear }) => {
  const [brand, setBrand] = useState<string>();
  const [model, setModel] = useState<string>();
  const [subModel, setSubModel] = useState<string>();
  const [condition, setCondition] = useState<string>();
  const [priceMin, setPriceMin] = useState<number>();
  const [priceMax, setPriceMax] = useState<number>();
  const [sort, setSort] = useState<SortOption>();

  const brands = Array.from(new Set(cars.map((c) => c.brand?.brandName).filter(Boolean)));
  const models = Array.from(
    new Set(
      cars
        .filter((c) => !brand || c.brand?.brandName === brand)
        .map((c) => c.model?.modelName)
        .filter(Boolean)
    )
  );
  const subModels = Array.from(
    new Set(
      cars
        .filter((c) => (!brand || c.brand?.brandName === brand) && (!model || c.model?.modelName === model))
        .map((c) => c.submodel?.submodelName)
        .filter(Boolean)
    )
  );
  const conditions = Array.from(new Set(cars.map((c) => c.condition).filter(Boolean)));

  const handleApply = () => {
    const filters: FilterValues = {
      brand,
      model,
      subModel,
      conditions: condition ? [condition] : undefined,
      priceRange: priceMin !== undefined && priceMax !== undefined ? [priceMin, priceMax] : undefined,
    };
    onApply(filters, sort);
  };

  const handleClear = () => {
    setBrand(undefined);
    setModel(undefined);
    setSubModel(undefined);
    setCondition(undefined);
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSort(undefined);
    onClear();
  };

  return (
    <div className="filter-sidebar">
      <Card title={<Title level={4} className="filter-title">Filter</Title>} className="filter-card">
        <Space direction="vertical" style={{ width: "100%" }}>
          <Select placeholder="เลือกยี่ห้อ" value={brand} onChange={(v) => { setBrand(v); setModel(undefined); setSubModel(undefined); }} allowClear>
            {brands.map((b) => <Option key={b} value={b}>{b}</Option>)}
          </Select>

          <Select placeholder="เลือกรุ่น" value={model} onChange={(v) => { setModel(v); setSubModel(undefined); }} allowClear>
            {models.map((m) => <Option key={m} value={m}>{m}</Option>)}
          </Select>

          <Select placeholder="เลือกซับรุ่น" value={subModel} onChange={setSubModel} allowClear>
            {subModels.map((sm) => <Option key={sm} value={sm}>{sm}</Option>)}
          </Select>

          <Select placeholder="เลือกสภาพรถ" value={condition} onChange={setCondition} allowClear>
            {conditions.map((c) => <Option key={c} value={c}>{c}</Option>)}
          </Select>

          <Select placeholder="เรียงลำดับ" value={sort} onChange={setSort} allowClear>
            <Option value="priceAsc">ราคาต่ำ → สูง</Option>
            <Option value="priceDesc">ราคาสูง → ต่ำ</Option>
            <Option value="yearUsedAsc">ปีเก่าน้อย → มาก</Option>
            <Option value="yearUsedDesc">ปีมาก → น้อย</Option>
          </Select>

          <Space>
            <Button type="primary" onClick={handleApply}>ใช้ Filter</Button>
            <Button onClick={handleClear}>ล้างค่า</Button>
          </Space>
        </Space>
      </Card>
    </div>
  );
};

export default Filter;
