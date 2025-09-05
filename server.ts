import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { setupRouterkHandlers } from "./src/router"

dotenv.config();

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, "imgs", req.url || "");
    const safePath = path.normalize(filePath).startsWith(path.join(__dirname, "imgs"));
    if (!safePath) {
        res.writeHead(403, { "Content-Type": "text/plain" });
        res.end("403 Forbidden");
        return;
    }
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("404 Not Found");
            return;
        }
        fs.readFile(filePath, (err2, content) => {
            if (err2) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("500 Internal Server Error");
                return;
            }
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(content);
        });
    });
});

// v4 doğru kullanım:
const io = new Server(server, {
    transports: ["websocket", "polling"],
    cors: { origin: "*" },
});

io.of(/^\/db-\w+$/).on("connection", (socket) => {
    const namespace = socket.nsp.name;
    const dbName = namespace.replace("/db-", "");
    console.log(`New connection to namespace: ${namespace}, using DB: ${dbName}`);
    
    setupRouterkHandlers(socket, dbName);
});

const PORT = Number(process.env.PORT || 80);
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
