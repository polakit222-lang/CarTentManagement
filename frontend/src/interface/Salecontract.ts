import type { Employee } from "../interface/Employee";
import type { Sale } from "../interface/Sale";
import type { Customer } from "../interface/Customer";

export interface SaleContract {
    id: string;
    customer_id?: Customer;
    status: string;
    car_sale_id?: Sale;
    employee_id?: Employee;
}