import { THallAddForm, THallGetResponse, THallUpdateForm } from "../models";
import service from '../Services/halls.service';

export default class HallsController {
    static async createHall(dbName: string, socket: any, data: THallAddForm) {
        console.log("createHall called with data:", data);
        
        try {
            const newHall = await service.createHall(dbName, data);
            socket.emit("hall:created", { status: "success", data: newHall });
            return;
        }
        catch (error) {
            return `Error in createHall: + ${error}`
        }
    }
    static async getHalls(dbName: string, callback: (result: { status: string, data: THallGetResponse }) => void) {
        try {
            const halls = await service.getHalls(dbName);
            callback({ status: "success", data: halls });
        } catch (error) {
            return `Error in getHalls: + ${error}`
        }
    }
    static async updateHall(dbName: string, socket: any, hallId: string, data: THallUpdateForm) {
        try {
            const updatedHall = await service.updateHall(dbName, hallId, data);
            socket.emit("/updateHallResponse", { status: "success", data: updatedHall });
        } catch (error) {
            return `Error in updateHall: + ${error}`
        }
    }
    static async deleteHall(dbName: string, socket: any, hallId: string) {
        try {
            const deletedHall = await service.deleteHall(dbName, hallId);
            socket.emit("/deleteHallResponse", { status: "success", data: deletedHall });
        } catch (error) {
            return `Error in deleteHall: + ${error}`
        }
    }
}
