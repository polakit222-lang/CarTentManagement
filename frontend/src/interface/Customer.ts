import type dayjs from "dayjs";

export interface Customer {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    password: string;
    email: string;
    phone_number: string;
    birthdate: dayjs.Dayjs;
}
