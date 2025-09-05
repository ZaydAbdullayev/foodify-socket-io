import { THallAddForm, THallUpdateForm } from "../models";
import crypto from 'crypto';
import { ResultSetHeader } from "mysql2";
const db = require("../query.database");

export default class HallsService {
    static async createHall(dbName: string, data: THallAddForm) {
        try {
            data.hall_id = crypto.randomBytes(4).toString('hex');
            const query = "INSERT INTO halls SET ?";
            const values = [data];
            const result = (await db.dbQuery(dbName, query, values)) as ResultSetHeader;


            if (result?.affectedRows === 0) {
                throw new Error("Failed to create hall");
            }

            return data;
        } catch (error) {
            throw new Error(`Error in createHall: ${error}`);
        }
    }

    static async getHalls(dbName: string) {
        const query = "SELECT * FROM halls WHERE status != 99";
        try {
            const halls = await db.dbQuery(dbName, query);
            return halls;
        } catch (error) {
            throw new Error(`Error in getHalls: ${error}`);
        }
    }
    static async updateHall(dbName: string, hallId: string, data: THallUpdateForm) {
        try {
            const query = "UPDATE halls SET ? WHERE hall_id = ?";
            const values = [data, hallId];
            const result = await db.dbQuery(dbName, query, values);

            if (result?.affectedRows === 0) {
                throw new Error("Failed to update hall or no changes made");
            }

            return { ...data, hall_id: hallId };
        } catch (error) {
            throw new Error(`Error in updateHall: ${error}`);
        }
    }
    static async deleteHall(dbName: string, hallId: string) {
        try {
            const query = "UPDATE halls SET status = 99 WHERE hall_id = ?";
            const values = [hallId];
            const result = await db.dbQuery(dbName, query, values);

            if (result?.affectedRows === 0) {
                throw new Error("Failed to delete hall or hall not found");
            }

            return { message: "Hall deleted successfully", hall_id: hallId };
        } catch (error) {
            throw new Error(`Error in deleteHall: ${error}`);
        }
    }
}
