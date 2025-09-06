
export interface Employee {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;

  profileimage: string;
  first_name: string;
  last_name: string;
  password?: string; // Mapped to optional because it's sensitive information
  email: string;
  phone_number: string;
  address: string;
  start_date: string; // Mapped from time.Time in Go
  sex: string;
  position: string;
  jobtype: string; // Mapped from time.Time in Go

  total_sales: unknown; // Mapped from Status type with gorm:"-" tag
}