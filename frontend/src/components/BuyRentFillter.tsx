//src/components/Filter.tsx
import React, { useMemo, useState } from 'react';
import {
  Select,
  Slider,
  InputNumber,
  Button,
  Divider,
  Checkbox,
  Typography,
} from 'antd';

const { Title } = Typography;

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
  <div
    className="sidebar"
    style={{
      width: `${width}px`,
      backgroundColor: '#262626',
      padding: 16,
      boxShadow: '0 0 12px rgba(255, 215, 0, 0.3)',
      position: 'relative',  // ✅ ทำให้ z-index ทำงาน
      zIndex: 0,             // ✅ ให้ต่ำกว่า navbar (navbar ควรมี z-index > 10)
      color: 'white',
      borderRadius: 12,
      border: "2px solid gold",
      transition: "box-shadow 0.3s ease-in-out",
    }}
      onMouseEnter={(e) =>
      (e.currentTarget.style.boxShadow = "0 4px 12px rgba(255, 215, 0, 0.4)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
  >
    {/* Title */}
    <div className="sidebar-header">
      <div className="sidebar-title">
        <Title level={4} style={{ color: "gold", margin: '2px 0' }}>
          ค้นหารถยนต์
        </Title>
      </div>
    </div>

    <Divider style={{ margin: '8px 0', borderColor: 'rgba(255, 215, 0, 0.3)' }} />

    {/* Brand */}
    {enabledFilters.includes('brand') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>ยี่ห้อ</label>
        <Select
          placeholder="เลือกแบรนด์"
          value={brand}
          onChange={(v) => { setBrand(v); setModel(undefined); }}
          allowClear
          options={brandOptions}
          style={{
            width: '100%',
            backgroundColor: '#2a2a2a',
            borderRadius: 5,
            color: 'white'
          }}
          dropdownStyle={{ backgroundColor: '#2a2a2a', color: 'white' }}
        />
      </div>
    )}

    {/* Model */}
    {enabledFilters.includes('model') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>รุ่น</label>
        <Select
          placeholder="เลือกรุ่น"
          value={model}
          onChange={(v) => setModel(v)}
          allowClear
          options={modelOptions}
          disabled={modelList.length === 0}
          style={{
            width: '100%',
            backgroundColor: '#2a2a2a',
            borderRadius: 5,
            color: 'white'
          }}
          dropdownStyle={{ backgroundColor: '#2a2a2a', color: 'white' }}
        />
      </div>
    )}

    {/* Price */}
    {enabledFilters.includes('price') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>ราคา (฿)</label>
      <Slider
        range
        min={Math.floor(priceMinDefault)}
        max={Math.ceil(priceMaxDefault)}
        value={priceRange}
        onChange={onPriceSliderChange}
        trackStyle={[{ backgroundColor: 'gold' }]}
        handleStyle={[
          {
            backgroundColor: 'gold',
            borderColor: 'gold',
            boxShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
            transition: 'box-shadow 0.2s ease-in-out',
          },
          {
            backgroundColor: 'gold',
            borderColor: 'gold',
            boxShadow: '0 0 6px rgba(255, 215, 0, 0.5)',
            transition: 'box-shadow 0.2s ease-in-out',
          },
        ]}
        railStyle={{ backgroundColor: '#555' }}
      />
        <div className="range-values" style={{ marginTop: 4, display: 'flex', justifyContent: 'space-between' }}>
          <InputNumber
            value={priceRange[0]}
            onChange={(v) => setPriceRange([Number(v ?? 0), priceRange[1]])}
            style={{ width: '45%', backgroundColor: '#2a2a2a', color: 'white' }}
          />
          <span style={{ color: 'gold' }}>—</span>
          <InputNumber
            value={priceRange[1]}
            onChange={(v) => setPriceRange([priceRange[0], Number(v ?? priceRange[1])])}
            style={{ width: '45%', backgroundColor: '#2a2a2a', color: 'white' }}
          />
        </div>
      </div>
    )}

    {/* Year */}
    {enabledFilters.includes('year') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>ปีที่ผลิต</label>
        <Slider
          range
          min={Math.floor(yearMinDefault)}
          max={Math.ceil(yearMaxDefault)}
          value={yearRange}
          onChange={onYearSliderChange}
          trackStyle={[{ backgroundColor: 'gold' }]}
          handleStyle={[
            { backgroundColor: 'gold', borderColor: 'gold' },
            { backgroundColor: 'gold', borderColor: 'gold' },
          ]}
          railStyle={{ backgroundColor: '#555' }}
        />
        <div className="range-values small" style={{ marginTop: 4, color: 'gold', display: 'flex', justifyContent: 'space-between' }}>
          <span>{yearRange[0]}</span>
          <span>{yearRange[1]}</span>
        </div>
      </div>
    )}

    {/* Usage */}
    {enabledFilters.includes('usage') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>อายุการใช้งาน (ปี)</label>
        <Slider
          range
          min={0}
          max={20}
          value={usageRange ?? [0, 20]}
          onChange={(val) => setUsageRange(val as [number, number])}
          trackStyle={[{ backgroundColor: 'gold' }]}
          handleStyle={[
            { backgroundColor: 'gold', borderColor: 'gold' },
            { backgroundColor: 'gold', borderColor: 'gold' },
          ]}
          railStyle={{ backgroundColor: '#555' }}
        />
        <div className="range-values small" style={{ color: 'gold', display: 'flex', justifyContent: 'space-between' }}>
          <span>{usageRange ? usageRange[0] : 0} ปี</span>
          <span>{usageRange ? usageRange[1] : 20} ปี</span>
        </div>
      </div>
    )}

    {/* Checkbox Sections */}
    {enabledFilters.includes('available') && (
      <div className="filter-section">
        <Checkbox
          checked={isAvailable}
          onChange={(e) => setIsAvailable(e.target.checked)}
          style={{ color: 'white' }}
        >
          มีประกัน
        </Checkbox>
      </div>
    )}

    {enabledFilters.includes('conditions') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>สภาพรถ</label>
        <Checkbox.Group
          options={[
            { label: 'สวย', value: 'สวย' },
            { label: 'ปานกลาง', value: 'ปานกลาง' },
            { label: 'แย่', value: 'แย่' },
          ]}
          value={conditions}
          onChange={(checkedValues) => setConditions(checkedValues.map(v => String(v)))}
          style={{ color: 'white' }}
        />
      </div>
    )}

    {/* Extras */}
    {enabledFilters.includes('extras') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>สิ่งอำนวยความสะดวก</label>
        <Checkbox.Group
          options={[
            { label: 'กล้องหลัง', value: 'กล้องหลัง' },
            { label: 'เซ็นเซอร์', value: 'เซ็นเซอร์' },
            { label: 'จอสัมผัส', value: 'จอสัมผัส' },
          ]}
          value={extras}
          onChange={onExtrasChange}
          style={{ color: 'white' }}
        />
      </div>
    )}

    {/* Status */}
    {enabledFilters.includes('status') && (
      <div className="filter-section">
        <label className="label" style={{ color: "white" }}>สถานะรถยนต์</label>
        <Checkbox.Group
          options={[
            { label: 'กำลังขาย', value: 'กำลังขาย' },
            { label: 'กำลังให้เช่า', value: 'กำลังให้เช่า' },
            { label: 'ยังไม่ดำเนินการ', value: 'ยังไม่ดำเนินการ' },
          ]}
          value={status}
          onChange={(checkedValues) => setStatus(checkedValues.map(v => String(v)))}
          style={{ color: 'white' }}
        />
      </div>
    )}

    {/* Buttons */}
    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
      <Button
        onClick={handleClear}
        block
        style={{
          backgroundColor: '#333',
          color: 'gold',
          border: '1px solid gold',
          fontWeight: 'bold',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#444')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = '#333')
        }
      >
        ล้าง
      </Button>

            <Button
        type="primary"
        onClick={handleApply}
        block
        style={{
          backgroundColor: 'gold',
          color: '#1a1a1a',
          fontWeight: 'bold',
          border: 'none',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = '#ffd700')
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = 'gold')
        }
      >
        ใช้ตัวกรอง
      </Button>
    </div>

    <div style={{ marginTop: 18, color: '#ccc', fontSize: 12, textAlign: 'center' }}>
      ผลลัพธ์จะอัพเดตเมื่อกด "ใช้ตัวกรอง"
    </div>
  </div>
);

};

export default Filter;
