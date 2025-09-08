import React, { useState, useMemo } from 'react';
import { Slider, InputNumber, Button, Divider, Select, Input, Checkbox } from 'antd';
import type { CarInfo, CarForSale } from '../interface/Car';
import "../style/sidebar.css";

const { Option } = Select;

export type FilterValues = {
  brand?: string | null;
  model?: string | null;
  subModel?: string | null;
  priceRange?: [number, number];
  ageRange?: [number, number];   // ✅ ใช้อายุการใช้งานแทน yearRange
  mileageMax?: number | null;
  conditions?: string[];
  status?: string[];
};

type EnabledFilter =
  | 'brand'
  | 'model'
  | 'subModel'
  | 'price'
  | 'age'
  | 'mileage'
  | 'conditions'
  | 'status';

type Props = {
  carList?: CarInfo[];
  saleCarList?: CarForSale[];
  width?: number;
  defaultValues?: FilterValues;
  onApply?: (values: FilterValues) => void;
  onClear?: () => void;
  enabledFilters?: EnabledFilter[];
};

const safeMin = (arr: number[], fallback = 0) => arr.length > 0 ? Math.min(...arr) : fallback;
const safeMax = (arr: number[], fallback = 1000000) => arr.length > 0 ? Math.max(...arr) : fallback;

const Filter: React.FC<Props> = ({
  carList = [],
  saleCarList = [],
  width = 300,
  defaultValues,
  onApply,
  onClear,
  enabledFilters = ['brand','model','subModel','price','age','mileage','conditions','status'],
}) => {

  // รวมข้อมูลรถ (CarInfo)
  const mergedCars: CarInfo[] = saleCarList.length > 0 
    ? saleCarList.map(s => s.car!).filter(Boolean)
    : carList;

  // ราคา
  const priceNumbers = mergedCars.map(c => Number(c.purchase_price ?? 0)).filter(n => !Number.isNaN(n));
  const priceMinDefault = safeMin(priceNumbers, 0);
  const priceMaxDefault = safeMax(priceNumbers, 1000000);

  // อายุการใช้งาน (ปี) จาก purchase_date
  const ages = mergedCars
    .map(c => {
      if (!c.purchase_date) return null;
      const purchaseYear = new Date(c.purchase_date).getFullYear();
      return new Date().getFullYear() - purchaseYear;
    })
    .filter((n): n is number => n !== null);

  const ageMinDefault = safeMin(ages, 0);
  const ageMaxDefault = safeMax(ages, 30);

  // State
  const [brand, setBrand] = useState<string | null>(defaultValues?.brand ?? null);
  const [model, setModel] = useState<string | null>(defaultValues?.model ?? null);
  const [subModel, setSubModel] = useState<string | null>(defaultValues?.subModel ?? null);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    defaultValues?.priceRange ?? [priceMinDefault, priceMaxDefault]
  );
  const [ageRange, setAgeRange] = useState<[number, number]>(
    defaultValues?.ageRange ?? [ageMinDefault, ageMaxDefault]
  );
  const [mileageMax, setMileageMax] = useState<number | null>(defaultValues?.mileageMax ?? null);
  const [conditions, setConditions] = useState<string[]>(defaultValues?.conditions ?? []);
  const [status, setStatus] = useState<string[]>(defaultValues?.status ?? []);

  // Dropdown options
  const brandOptions = Array.from(new Set(mergedCars.map(c => c.detail?.Brand?.brand_name).filter(Boolean))) as string[];
  
  const modelOptions = useMemo(() => {
    if (!brand) return [];
    return Array.from(new Set(
      mergedCars
        .filter(c => c.detail?.Brand?.brand_name === brand)
        .map(c => c.detail?.CarModel?.ModelName)
        .filter(Boolean)
    )) as string[];
  }, [brand, mergedCars]);

  const subModelOptions = useMemo(() => {
    if (!model) return [];
    return Array.from(new Set(
      mergedCars
        .filter(c => c.detail?.CarModel?.ModelName === model)
        .map(c => c.detail?.SubModel?.SubModelName)
        .filter(Boolean)
    )) as string[];
  }, [model, mergedCars]);

  // Apply filter
  const handleApply = () => {
    onApply?.({
      brand,
      model,
      subModel,
      priceRange,
      ageRange,
      mileageMax,
      conditions,
      status,
    });
  };

  const handleClear = () => {
    setBrand(null);
    setModel(null);
    setSubModel(null);
    setPriceRange([priceMinDefault, priceMaxDefault]);
    setAgeRange([ageMinDefault, ageMaxDefault]);
    setMileageMax(null);
    setConditions([]);
    setStatus([]);
    onClear?.();
  };

  return (
    <div className="sidebar" style={{ width: `${width}px` }}>
      <div className="sidebar-top-strip" />
      <div className="sidebar-header">
        <div className="sidebar-title">ค้นหารถยนต์</div>
      </div>
      <Divider />

      {/* Brand */}
      {enabledFilters.includes('brand') && (
        <div className="filter-section">
          <label className="label">ยี่ห้อ</label>
          <Select
            placeholder="เลือกยี่ห้อ"
            value={brand}
            onChange={(val) => { setBrand(val); setModel(null); setSubModel(null); }}
            style={{ width: '100%' }}
            allowClear
          >
            {brandOptions.map(b => <Option key={b} value={b}>{b}</Option>)}
          </Select>
        </div>
      )}

      {/* Model */}
      {enabledFilters.includes('model') && (
        <div className="filter-section">
          <label className="label">รุ่น</label>
          <Select
            placeholder="เลือกรุ่น"
            value={model}
            onChange={(val) => { setModel(val); setSubModel(null); }}
            style={{ width: '100%' }}
            allowClear
            disabled={!brand}
          >
            {modelOptions.map(m => <Option key={m} value={m}>{m}</Option>)}
          </Select>
        </div>
      )}

      {/* SubModel */}
      {enabledFilters.includes('subModel') && (
        <div className="filter-section">
          <label className="label">ซับโมเดล</label>
          <Select
            placeholder="เลือกซับโมเดล"
            value={subModel}
            onChange={(val) => setSubModel(val)}
            style={{ width: '100%' }}
            allowClear
            disabled={!model}
          >
            {subModelOptions.map(sm => <Option key={sm} value={sm}>{sm}</Option>)}
          </Select>
        </div>
      )}

      {/* Price */}
      {enabledFilters.includes('price') && (
        <div className="filter-section">
          <label className="label">ราคา (฿)</label>
          <Slider
            range
            min={Math.floor(priceMinDefault)}
            max={Math.ceil(priceMaxDefault)}
            value={priceRange}
            onChange={(val) => setPriceRange(val as [number, number])}
          />
          <div className="range-values" style={{ marginTop: 4 }}>
            <InputNumber
              value={priceRange[0]}
              onChange={(v) => setPriceRange([Number(v ?? 0), priceRange[1]])}
              style={{ width: '45%' }}
            />
            <span style={{ margin: '0 4px' }}>—</span>
            <InputNumber
              value={priceRange[1]}
              onChange={(v) => setPriceRange([priceRange[0], Number(v ?? priceRange[1])])}
              style={{ width: '45%' }}
            />
          </div>
        </div>
      )}

      {/* Age (usage) */}
      {enabledFilters.includes('age') && (
        <div style={{ marginBottom: 20 }}>
        <p>อายุการใช้งาน (ปี)</p>
        <Slider
          range
          min={1}
          max={30}
          step={1}
          value={ageRange}
          onChange={(val) => setAgeRange(val as [number, number])}
        />
        <p>{`${ageRange[0]} - ${ageRange[1]} ปี`}</p>
      </div>

      )}

      {/* Mileage */}
      {enabledFilters.includes('mileage') && (
        <div className="filter-section">
          <label className="label">ไมล์สูงสุด (กม.)</label>
          <InputNumber
            placeholder="เช่น 100000"
            style={{ width: '100%' }}
            value={mileageMax ?? undefined}
            onChange={(v) => setMileageMax(v === undefined ? null : Number(v))}
            min={0}
          />
        </div>
      )}

      {/* Conditions */}
      {enabledFilters.includes('conditions') && (
        <div className="filter-section">
          <label className="label">สภาพรถ</label>
          <Checkbox.Group
            options={[
              { label: 'ดี', value: 'ดี' },
              { label: 'ปานกลาง', value: 'ปานกลาง' },
              { label: 'แย่', value: 'แย่' },
            ]}
            value={conditions}
            onChange={(checkedValues) => setConditions(checkedValues.map(v => String(v)))}
          />
        </div>
      )}

      {/* Status */}
      {enabledFilters.includes('status') && (
        <div className="filter-section">
          <label className="label">สถานะรถยนต์</label>
          <Checkbox.Group
            options={[
              { label: 'กำลังขาย', value: 'selling' },
              { label: 'กำลังให้เช่า', value: 'renting' },
              { label: 'ยังไม่ดำเนินการ', value: 'pending' },
            ]}
            value={status}
            onChange={(checkedValues) => setStatus(checkedValues.map(v => String(v)))}
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button onClick={handleClear} block>ล้าง</Button>
        <Button type="primary" onClick={handleApply} block>ใช้ตัวกรอง</Button>
      </div>
    </div>
  );
};

export default Filter;
