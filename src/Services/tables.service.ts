import { TTableAddForm, TTableUpdateForm } from "../models";
import crypto from 'crypto';

const db = require("../query.database");

export default class tablesService {
    static async createTable(dbName: string, data: TTableAddForm) {
        try {
            data.table_id = crypto.randomBytes(4).toString('hex');
            const query = "INSERT INTO tables SET ?";
            const values = [data];
            const result = await db.dbQuery(dbName, query, values);

            if (result?.affectedRows === 0) {
                throw new Error("Failed to create table");
            }

            return data;
        } catch (error) {
            throw new Error(`Error in createTable: ${error}`);
        }
    }
    static async getTables(dbName: string) {
        const query = "SELECT * FROM tables WHERE status != 99";
        try {
            const tables = await db.dbQuery(dbName, query);
            return tables;
        } catch (error) {
            throw new Error(`Error in getTables: ${error}`);
        }
    }
    static async updateTable(dbName: string, tableId: string, data: TTableUpdateForm) {
        try {
            const query = "UPDATE tables SET ? WHERE table_id = ?";
            const values = [data, tableId];
            const result = await db.dbQuery(dbName, query, values);

            if (result?.affectedRows === 0) {
                throw new Error("Failed to update table or no changes made");
            }

            return { ...data, table_id: tableId };
        } catch (error) {
            throw new Error(`Error in updateTable: ${error}`);
        }
    }
    static async deleteTable(dbName: string, tableId: string) {
        try {
            const query = "UPDATE tables SET status = 99 WHERE table_id = ?";
            const values = [tableId];
            const result = await db.dbQuery(dbName, query, values);

            if (result?.affectedRows === 0) {
                throw new Error("Failed to delete table or table not found");
            }

            return { message: "Table deleted successfully", table_id: tableId };
        } catch (error) {
            throw new Error(`Error in deleteTable: ${error}`);
        }
    }
}
