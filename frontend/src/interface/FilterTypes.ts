// types/FilterTypes.ts
export type FilterValues = {
  brand?: string | null;
  model?: string | null;
  subModel?: string | null;
  priceRange?: [number, number];
  ageRange?: [number, number];
  mileageMax?: number | null;
  conditions?: string[];
  status?: string[];
};

export type FilterConfig = {
  key: keyof FilterValues;
  label: string;
  type: 'select' | 'range' | 'number' | 'checkbox';
  options?: string[]; // สำหรับ checkbox
  dependsOn?: keyof FilterValues;
  getOptions?: (cars: any[], selected: FilterValues) => string[];
  min?: number;
  max?: number;
  minKey?: string; // สำหรับ range
  maxKey?: string;
};
