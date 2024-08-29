"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userRouter_1 = __importDefault(require("../../presentation/routes/userRouter"));
const adminRouter_1 = __importDefault(require("../../presentation/routes/adminRouter"));
const restaurantRouter_1 = __importDefault(require("../../presentation/routes/restaurantRouter"));
const tokenAuthRouter_1 = __importDefault(require("../../presentation/routes/tokenAuthRouter"));
const chatRouters_1 = __importDefault(require("../../presentation/routes/chatRouters"));
const routes = (app) => {
    app.use("/api/", userRouter_1.default);
    app.use("/admin/", adminRouter_1.default);
    app.use("/restaurant/", restaurantRouter_1.default);
    app.use("/token/", tokenAuthRouter_1.default);
    app.use("/api/inbox/", chatRouters_1.default);
};
exports.default = routes;
