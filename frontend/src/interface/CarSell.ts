// src/interface/CarSell.ts
export interface CarSell {
  id: number;
  description: string;
  periods: unknown; // You might want to define a more specific type for this
  SalePerson_ID?: number; // Added SalePerson_ID as an optional field
}