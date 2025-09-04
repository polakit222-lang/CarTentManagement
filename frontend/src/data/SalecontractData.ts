import type { SaleContract } from "../interface/Salecontract";
import { Customers } from "../data/CustomerData";
import { Sales } from "../data/SaleData";
import { Employees } from "../data/EmployeeData";

export const SaleContracts: SaleContract[] = [
    {
        id: "1",
        customer_id: {
            id: Customers[0].id,
            username: Customers[0].username,
            first_name: Customers[0].first_name,
            last_name: Customers[0].last_name,
            password: Customers[0].password,
            email: Customers[0].email,
            birthdate: Customers[0].birthdate,
            phone_number: Customers[0].phone_number
        },
        status: "active",
        car_sale_id: {
            id: Sales[0].id,
            discount: Sales[0].discount,
            car_id: Sales[0].car_id,
            sale_date: Sales[0].sale_date,
            manager_id: Sales[0].manager_id,
            price: Sales[0].price
        },
        employee_id: {
            id: Employees[0].id,
            first_name: Employees[0].first_name,
            last_name: Employees[0].last_name,
            position: Employees[0].position,
            phone_number: Employees[0].phone_number,
            start_date: Employees[0].start_date,
            status: Employees[0].status,
            total_sales: Employees[0].total_sales
        }
    },
    {
        id: "2",
        customer_id: Customers[0],
        status: "inactive",
        car_sale_id: Sales[1],
        employee_id: Employees[1]
    }
];