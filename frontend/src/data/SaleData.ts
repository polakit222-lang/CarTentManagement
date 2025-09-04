import type { Sale } from "../interface/Sale";
import dayjs from "dayjs";
import {  } from "../interface/Car";

export const Sales: Sale[] = [
    {
        id: "1",
        price: 30000,
        discount: "10%",
        car_id: 1,
        sale_date: dayjs("2023-01-15"),
        manager_id: 1
    },
    {
        id: "2",
        price: 25000,
        discount: "5%",
        car_id: 2,
        sale_date: dayjs("2023-02-20"),
        manager_id: 2
    },
    {
        id: "3",
        price: 20000,
        discount: "15%",
        car_id: 3,
        sale_date: dayjs("2023-03-10"),
        manager_id: 1
    }
]