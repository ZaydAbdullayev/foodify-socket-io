import { THallAddForm, THallUpdateForm, TTableAddForm, TTableUpdateForm } from "./models";
// CommonJS yerine ES import kullan:
import halls from "./Controllers/halls";
import tables from "./Controllers/tables";

export function setupRouterkHandlers(socket: any, dbName: string) {
    // Event isimlerinde baştaki "/" gereksiz, kaldır:
    socket.on("hall:add", async (data: THallAddForm) => { await halls.createHall(dbName, socket, data); });
    socket.on("hall:get", async (callback: () => void) => { await halls.getHalls(dbName, callback); });
    socket.on("hall:update", async (data: THallUpdateForm) => { await halls.updateHall(dbName, socket, data.hall_id, data); });
    socket.on("hall:delete", async (data: { hall_id: string }) => { await halls.deleteHall(dbName, socket, data.hall_id); });

    socket.on("table:add", async (data: TTableAddForm) => { await tables.createTable(dbName, socket, data); });
    socket.on("table:get", async (callback: () => void) => { await tables.getTables(dbName, callback); });
    socket.on("table:update", async (data: TTableUpdateForm) => { await tables.updateTable(dbName, socket, data.table_id, data); });
    socket.on("table:delete", async (data: { table_id: string }) => { await tables.deleteTable(dbName, socket, data.table_id); });
}
