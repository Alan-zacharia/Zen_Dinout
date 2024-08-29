"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Modules import */
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
/** Folders import */
const envConfig_1 = __importDefault(require("./configs/envConfig"));
const routes_1 = __importDefault(require("./application/routes/routes"));
const databaseConfig_1 = __importDefault(require("./configs/databaseConfig"));
const socketConfig_1 = __importDefault(require("./configs/socketConfig"));
const membershipReminder_1 = require("./infrastructure/cron/jobs/membershipReminder");
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: envConfig_1.default.CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ credentials: true, origin: envConfig_1.default.CLIENT_URL }));
app.use((0, cookie_parser_1.default)());
(0, socketConfig_1.default)(io);
(0, databaseConfig_1.default)();
(0, routes_1.default)(app);
(0, membershipReminder_1.membershipCronJob)();
app.listen(envConfig_1.default.PORT, () => {
    console.log("Server is running on http://localhost:" + envConfig_1.default.PORT);
});
