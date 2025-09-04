import type dayjs from "dayjs";

export interface Employee {
    id: string;
    first_name: string;
    last_name: string;
    position: string;
    phone_number: string;
    start_date: dayjs.Dayjs;
    status: string;
    total_sales: number;
}