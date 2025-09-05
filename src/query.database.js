// db.js
const knex = require("knex");

const dbConnections = {}; // { dbName: { knex, lastUsed } }
const TTL_MS = 15 * 60 * 1000;        // 15 dakika idle timeout
const CLEANUP_INTERVAL = 60 * 1000;   // her 1 dk’da kontrol

const createDbConnection = (dbName) => {
    if (!dbConnections[dbName]) {
        dbConnections[dbName] = {
            knex: knex({
                client: "mysql2",
                connection: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: dbName,
                    charset: "utf8mb4",
                },
                pool: {
                    min: 1,
                    max: 10,
                    idleTimeoutMillis: TTL_MS,      // boş connection TTL
                    reapIntervalMillis: 30_000,    // her 30sn pool taraması
                },
                acquireConnectionTimeout: 10_000, // connection bulamazsa 10sn sonra hata
            }),
            lastUsed: Date.now()
        };
        console.log(`[DB] pool created: ${dbName}`);
    } else {
        // aktif kullanımda lastUsed güncelleniyor
        dbConnections[dbName].lastUsed = Date.now();
    }

    return dbConnections[dbName].knex;
};

const dbQuery = async (dbName, query, values = []) => {
    const entry = createDbConnection(dbName);
    try {
        const result = await entry.raw(query, values);
        // Knex + mysql2 => genelde [rows, fields] döner
        return Array.isArray(result) ? result[0] : result;
    } catch (err) {
        console.error("Error executing query:", err);
        throw err;
    }
};

// Idle connection cleanup (sliding TTL)
setInterval(() => {
    const now = Date.now();
    for (const [dbName, entry] of Object.entries(dbConnections)) {
        if (now - entry.lastUsed > TTL_MS) {
            entry.knex.destroy().catch(() => { });
            delete dbConnections[dbName];
            console.log(`[DB] pool closed (idle): ${dbName}`);
        }
    }
}, CLEANUP_INTERVAL).unref();

// Graceful shutdown (tüm pool’ları kapat)
const destroyAll = async () => {
    await Promise.all(
        Object.values(dbConnections).map((entry) =>
            entry.knex.destroy().catch(() => { })
        )
    );
};

process.on("SIGINT", async () => {
    await destroyAll();
    process.exit(0);
});
process.on("SIGTERM", async () => {
    await destroyAll();
    process.exit(0);
});

module.exports = { dbQuery, createDbConnection };
