import type dayjs from "dayjs";

export interface Customer {
    ID: string;
    FirstName: string;
    LastName: string;
    Password: string;
    Email: string;
    Phone: string;
    Birthday: dayjs.Dayjs;
}

