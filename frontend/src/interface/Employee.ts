export interface Employee {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;

  profileimage: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  phone_number: string;
  address: string;
  start_date: string;
  sex: string;
  position: string;
  jobtype: string;

  total_sales: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt?: string | null;
    Status: string;
    Insurance: unknown | null;
  };

  PickupDelivery?: unknown | null;
  Car?: unknown | null;
  SaleList?: unknown | null;
  SalesContract?: unknown | null;
  LeaveRequest?: unknown | null;
}
