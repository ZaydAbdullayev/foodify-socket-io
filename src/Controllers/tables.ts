import { TTableAddForm, TTableGetResponse, TTableUpdateForm } from "../models";
import service from "../Services/tables.service";

export default class TablesController {
    static async createTable(dbName: string, socket: any, data: TTableAddForm) {
        try {
            const newTable = await service.createTable(dbName, data);
            socket.emit("/createTableResponse", { status: "success", data: newTable });
        } catch (error: any) {
            socket.emit("/createTableResponse", { status: "error", message: error.message });
        }
    }

    static async getTables(dbName: string, callback: (result: { status: string, data: TTableGetResponse } | { status: string, message: string }) => void) {
        try {
            const tables = await service.getTables(dbName);
            callback({ status: "success", data: tables });
        } catch (error: any) {
            callback({ status: "error", message: error.message });
        }
    }

    static async updateTable(dbName: string, socket: any, tableId: string, data: TTableUpdateForm) {
        try {
            const updatedTable = await service.updateTable(dbName, tableId, data);
            socket.emit("/updateTableResponse", { status: "success", data: updatedTable });
        } catch (error: any) {
            socket.emit("/updateTableResponse", { status: "error", message: error.message });
        }
    }

    static async deleteTable(dbName: string, socket: any, tableId: string) {
        try {
            const deletedTable = await service.deleteTable(dbName, tableId);
            socket.emit("/deleteTableResponse", { status: "success", data: deletedTable });
        } catch (error: any) {
            socket.emit("/deleteTableResponse", { status: "error", message: error.message });
        }
    }
}
