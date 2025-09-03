//src/components/Filter.tsx
import React, { useMemo, useState } from 'react';
import {
  Select,
  Slider,
  InputNumber,
  Button,
  Divider,
  Checkbox,
} from 'antd';
type CheckboxValueType = string | number;

import type { CarInfo } from '../interface/Car';
import { carList as defaultCarList } from '../data/carList';
import "../style/sidebar.css";

export type FilterValues = {
  brand?: string | null;
  model?: string | null;
  priceRange?: [number, number];
  yearRange?: [number, number];
  usageRange?: [number, number];
  mileageMax?: number | null;
  isAvailable?: boolean;
  extras?: string[];
  conditions?: string[];
  status?: string[];
  
};
type EnabledFilter =
  | 'brand'
  | 'model'
  | 'price'
  | 'year'
  | 'mileage'
  | 'available'
  | 'conditions'
  | 'extras'
  | 'status'
  | 'usage';

type Props = {
  carList?: CarInfo[];
  width?: number;
  defaultValues?: FilterValues;
  onApply?: (values: FilterValues) => void;
  onClear?: () => void;
  enabledFilters?: EnabledFilter[];
};

const safeMin = (arr: number[], fallback = 0) =>
  arr.length > 0 ? Math.min(...arr) : fallback;
const safeMax = (arr: number[], fallback = 1000000) =>
  arr.length > 0 ? Math.max(...arr) : fallback;
const Filter: React.FC<Props> = ({
  carList = defaultCarList,
  width = 300,
  defaultValues,
  onApply,
  onClear,
  enabledFilters = [
    'brand',
    'model',
    'price',
    'year',
    'mileage',
    'available',
    'conditions',
    'extras',
    'status',
    'usage',
  ], // 👈 ถ้าไม่ส่งมา แสดงทั้งหมด
}) => {
  const brandList = useMemo(
    () => Array.from(new Set(carList.map((c) => c.brand))).filter(Boolean),
    [carList]
  ) as string[];

  const modelListAll = useMemo(
    () => Array.from(new Set(carList.map((c) => c.model))).filter(Boolean),
    [carList]
  ) as string[];

  const priceNumbers = carList.map((c) => Number(c.price ?? 0)).filter((n) => !Number.isNaN(n));
  const priceMinDefault = safeMin(priceNumbers, 0);
  const priceMaxDefault = safeMax(priceNumbers, 1000000);

  const yearNumbers = carList.map((c) => Number(c.yearManufactured ?? 0)).filter((n) => !Number.isNaN(n));
  const yearMinDefault = safeMin(yearNumbers, 1990);
  const yearMaxDefault = safeMax(yearNumbers, new Date().getFullYear());

  const [brand, setBrand] = useState<string | undefined>(defaultValues?.brand ?? undefined);
  const [model, setModel] = useState<string | undefined>(defaultValues?.model ?? undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>(
    defaultValues?.priceRange ?? [priceMinDefault, priceMaxDefault]
  );
  const [yearRange, setYearRange] = useState<[number, number]>(
    defaultValues?.yearRange ?? [yearMinDefault, yearMaxDefault]
  );
  const [mileageMax, setMileageMax] = useState<number | null>(defaultValues?.mileageMax ?? null);
  const [isAvailable, setIsAvailable] = useState<boolean>(defaultValues?.isAvailable ?? false);
  const [extras, setExtras] = useState<string[]>(defaultValues?.extras ?? []);
  const [conditions, setConditions] = useState<string[]>(defaultValues?.conditions ?? []);
  const [usageRange, setUsageRange] = useState<[number, number] | undefined>(undefined);
  const [status, setStatus] = useState<string[]>(defaultValues?.status ?? []);

  const modelList = useMemo(() => {
    if (!brand) return modelListAll;
    return Array.from(new Set(carList.filter((c) => c.brand === brand).map((c) => c.model))).filter(Boolean) as string[];
  }, [brand, carList, modelListAll]);
  
  const handleApply = () => {
    onApply?.({
      brand: brand ?? null,
      model: model ?? null,
      priceRange,
      yearRange,
      mileageMax,
      isAvailable,
      extras,
      conditions,
      status,
      usageRange,
    });
  };

  const handleClear = () => {
    setBrand(undefined);
    setModel(undefined);
    setPriceRange([priceMinDefault, priceMaxDefault]);
    setYearRange([yearMinDefault, yearMaxDefault]);
    setMileageMax(null);
    setIsAvailable(false);
    setExtras([]);
    setConditions([]);
    setStatus([]);
    setUsageRange(undefined);
    onClear?.();

  };

  const onExtrasChange = (checkedValues: CheckboxValueType[]) => {
    setExtras(checkedValues.map((v) => String(v)));
  };

  const onPriceSliderChange = (val: number | number[]) => {
    if (Array.isArray(val)) setPriceRange([Number(val[0]), Number(val[1])]);
    else setPriceRange([Number(val), Number(val)]);
  };

  const onYearSliderChange = (val: number | number[]) => {
    if (Array.isArray(val)) setYearRange([Number(val[0]), Number(val[1])]);
    else setYearRange([Number(val), Number(val)]);
  };

  const brandOptions = brandList.map((b) => ({ label: b, value: b }));
  const modelOptions = modelList.map((m) => ({ label: m, value: m }));

  return (
    <div className="sidebar" style={{ width: `${width}px` }}>
      <div className="sidebar-top-strip" />
      <div className="sidebar-header">
        <div className="sidebar-title">ค้นหารถยนต์</div>
      </div>
      <Divider style={{ margin: '8px 0', borderColor: 'rgba(255,255,255,0.04)' }} />

      {/* Brand */}
      {enabledFilters.includes('brand') && (
        <div className="filter-section">
          <label className="label">ยี่ห้อ</label>
          <Select
            placeholder="เลือกแบรนด์"
            value={brand}
            onChange={(v) => { setBrand(v); setModel(undefined); }}
            allowClear
            options={brandOptions}
            style={{ width: '100%', backgroundColor: 'white', borderRadius: 5 }}
          />
        </div>
      )}

      {/* Model */}
      {enabledFilters.includes('model') && (
        <div className="filter-section">
          <label className="label">รุ่น</label>
          <Select
            placeholder="เลือกรุ่น"
            value={model}
            onChange={(v) => setModel(v)}
            allowClear
            options={modelOptions}
            disabled={modelList.length === 0}
            style={{ width: '100%', backgroundColor: 'white', borderRadius: 5 }}
          />
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
            onChange={onPriceSliderChange}
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

      {/* Year */}
      {enabledFilters.includes('year') && (
        <div className="filter-section">
          <label className="label">ปีที่ผลิต</label>
          <Slider
            range
            min={Math.floor(yearMinDefault)}
            max={Math.ceil(yearMaxDefault)}
            value={yearRange}
            onChange={onYearSliderChange}
          />
          <div className="range-values small" style={{ marginTop: 4 }}>
            <span>{yearRange[0]}</span>
            <span>{yearRange[1]}</span>
          </div>
        </div>
      )}
      {enabledFilters.includes('usage') && (
        <div className="filter-section">
          <label className="label">อายุการใช้งาน (ปี)</label>
          <Slider
            range
            min={0}
            max={20}  // สมมุติว่ารถไม่เกิน 20 ปี
            value={usageRange ?? [0, 20]}
            onChange={(val) => setUsageRange(val as [number, number])}
          />
          <div className="range-values small">
            <span>{usageRange ? usageRange[0] : 0} ปี</span>
            <span>{usageRange ? usageRange[1] : 20} ปี</span>
          </div>
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

      {/* Availability */}
      {enabledFilters.includes('available') && (
        <div className="filter-section">
          <Checkbox
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          >
            มีประกัน
          </Checkbox>
        </div>
      )}

      {/* Conditions */}
      {enabledFilters.includes('conditions') && (
        <div className="filter-section">
          <label className="label">สภาพรถ</label>
          <Checkbox.Group
            options={[
              { label: 'สวย', value: 'สวย' },
              { label: 'ปานกลาง', value: 'ปานกลาง' },
              { label: 'แย่', value: 'แย่' },
            ]}
            value={conditions}
            onChange={(checkedValues) => setConditions(checkedValues.map(v => String(v)))}
            className="checkbox-conditions"
          />
        </div>
      )}

      {/* Extras */}
      {enabledFilters.includes('extras') && (
        <div className="filter-section">
          <label className="label">สิ่งอำนวยความสะดวก</label>
          <Checkbox.Group
            options={[
              { label: 'กล้องหลัง', value: 'กล้องหลัง' },
              { label: 'เซ็นเซอร์', value: 'เซ็นเซอร์' },
              { label: 'จอสัมผัส', value: 'จอสัมผัส' },
            ]}
            value={extras}
            onChange={onExtrasChange}
            className="checkbox-conditions"
          />
        </div>
      )}
      {enabledFilters.includes('status') && (
        <div className="filter-section">
          <label className="label">สถานะรถยนต์</label>
          <Checkbox.Group
            options={[
              { label: 'กำลังขาย', value: 'กำลังขาย' },
              { label: 'กำลังให้เช่า', value: 'กำลังให้เช่า' },
              { label: 'ยังไม่ดำเนินการ', value: 'ยังไม่ดำเนินการ' },
            ]}
            value={status}
            onChange={(checkedValues) => setStatus(checkedValues.map(v => String(v)))}
            className="checkbox-status"
          />
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button className="filter-clear" onClick={handleClear} block>
          ล้าง
        </Button>
        <Button className="filter-apply" type="primary" onClick={handleApply} block>
          ใช้ตัวกรอง
        </Button>
      </div>
      <br />


      <div style={{ marginTop: 18, color: '#9b9b9b', fontSize: 12 }}>
        <div>ผลลัพธ์จะอัพเดตเมื่อกด "ใช้ตัวกรอง"</div>
      </div>
    </div>

  );
};

export default Filter;
