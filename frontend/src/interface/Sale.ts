import type dayjs from "dayjs";
import type { Car } from "./Car";

export interface Sale {
    id: string;
    price: number;
    discount: string;
    car_id?: Car["id"];
    sale_date: dayjs.Dayjs;
    manager_id: number;
}
