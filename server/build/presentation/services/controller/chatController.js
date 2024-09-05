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
exports.chatController = void 0;
const Wintson_1 = __importDefault(require("../../../infrastructure/lib/Wintson"));
const conversationModel_1 = __importDefault(require("../../../infrastructure/database/model/conversationModel"));
const messageModel_1 = __importDefault(require("../../../infrastructure/database/model/messageModel"));
const userModel_1 = __importDefault(require("../../../infrastructure/database/model/userModel"));
const restaurantModel_1 = __importDefault(require("../../../infrastructure/database/model/restaurantModel"));
const messageNotificationModel_1 = __importDefault(require("../../../infrastructure/database/model/messageNotificationModel"));
class chatController {
    constructor() { }
    createNewConversation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId } = req.body;
            try {
                const existingConversation = yield conversationModel_1.default.findOne({
                    members: { $all: [senderId, receiverId] },
                });
                if (existingConversation) {
                    return res
                        .status(200)
                        .json({ savedConversation: existingConversation });
                }
                const newConversation = new conversationModel_1.default({
                    members: [senderId, receiverId],
                });
                const savedConversation = yield newConversation.save();
                return res.status(200).json({ savedConversation: savedConversation });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    getConversations(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const existingConversations = yield conversationModel_1.default.find({
                    members: { $in: userId },
                });
                return res.status(200).json({ conversations: existingConversations });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            const id = req.body.conversationId;
            try {
                const newMessage = new messageModel_1.default(req.body);
                const conversation = yield conversationModel_1.default.findByIdAndUpdate(id, {
                    $set: {
                        lastMessage: {
                            sender: req.body.sender,
                            text: req.body.text,
                            createdAt: new Date(),
                        },
                    },
                }, { new: true });
                const savedMessage = yield newMessage.save();
                return res.status(200).json({ savedMessage, conversation });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.receiverId;
            try {
                const user = yield userModel_1.default.findById(userId).select("username email");
                return res.status(200).json({ user });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    getRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantId = req.params.receiverId;
            try {
                const restaurant = yield restaurantModel_1.default
                    .findById(restaurantId)
                    .select("restaurantName email");
                return res.status(200).json({ restaurant });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const selectedChatId = req.params.selectedChatId;
            try {
                const messages = yield messageModel_1.default.find({
                    conversationId: selectedChatId,
                });
                return res.status(200).json({ messages });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
    getNotifications(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId;
            try {
                const notifications = yield messageNotificationModel_1.default.find({
                    receiverId: userId,
                });
                console.log(notifications);
                return res.status(200).json({ notifications });
            }
            catch (error) {
                Wintson_1.default.error(`Error in create new conversation ${error.message}`);
                return res.status(500).json("Internal server error...");
            }
        });
    }
}
exports.chatController = chatController;
