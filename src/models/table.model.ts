export type TTableAddForm = {
    table_id?: string;
    table_name: string;
    hall_id: string;
    capacity: number;
    percentage: number;
    hourly_cost: number;
};

export type TTableUpdateForm = {
    table_id: string;
    table_name?: string;
    hall_id?: string;
    capacity?: number;
    percentage?: number;
    hourly_cost?: number;
};

export type TTableGetResponse = {
    table_id: string;
    table_name: string;
    hall_id: string;
    capacity: number;
    percentage: number;
    hourly_cost: number;
}[];