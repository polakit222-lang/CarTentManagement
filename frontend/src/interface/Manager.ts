export interface Manager {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string | null;

  Username: string;
  Email: string;
  Password: string;
  FirstName: string;
  LastName: string;
  Birthday: string;

  SaleList?: unknown | null;
}
