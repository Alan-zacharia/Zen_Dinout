"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const messageModel_1 = __importDefault(require("../infrastructure/database/model.ts/messageModel"));
const socketConfig = (io) => {
    let users = [];
    const addUser = (userId, socketId) => {
        !users.some((user) => user.userId === userId) &&
            users.push({ userId, socketId });
    };
    const removeUser = (socketId) => {
        users = users.filter((user) => user.socketId !== socketId);
    };
    const getUser = (userId) => {
        return users.find((user) => user.userId == userId);
    };
    io.on("connection", (socket) => {
        console.log("A user connected 😃");
        socket.on("addUser", (userId) => {
            addUser(userId, socket.id);
            io.emit("getUsers", users);
        });
        socket.on("sendMessage", ({ senderId, receiverId, text, conversationId }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId,
                    text,
                });
                io.to(user.socketId).emit("notification", {
                    conversationId,
                    senderId,
                    text,
                });
            }
        });
        socket.on("senderTyping", ({ receiverId, conversationId, statsus }) => {
            const user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getSenderTyping", {
                    receiverId,
                    conversationId,
                    status,
                });
            }
        });
        socket.on("sendLastMessage", ({ senderId, text, conversationId }) => {
            console.log({ senderId, text, conversationId });
            const user = getUser(senderId);
            console.log(user);
            if (user) {
                io.to(user.socketId).emit("getLastMessage", {
                    conversationId,
                    senderId,
                    text,
                });
            }
        });
        socket.on("markMessageAsSeen", (_a) => __awaiter(void 0, [_a], void 0, function* ({ conversationId, userId }) {
            try {
                yield messageModel_1.default.updateMany({ conversationId: conversationId, sender: userId, seen: false }, { $set: { seen: true } });
                const user = getUser(userId);
                if (user) {
                    io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("messageSeen", { conversationId });
                }
            }
            catch (error) {
                console.log(error);
            }
        }));
        socket.on("disconnect", () => {
            console.log("A user disconnected 🚶‍♂️");
            removeUser(socket.id);
            io.emit("getUsers", users);
        });
    });
};
exports.default = socketConfig;
