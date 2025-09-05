export type THallAddForm = {
    hall_id?: string;
    hall: string;
    hall_capacity: number;
};

export type THallUpdateForm = {
    hall_id: string;
    hall: string;
    hall_capacity: number;
};

export type THallGetResponse = {
    hall_id: string;
    hall: string;
    hall_capacity: number;
}[];


