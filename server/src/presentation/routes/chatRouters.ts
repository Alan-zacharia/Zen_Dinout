import { Router } from "express";
import { chatController } from "../services/controller/chatController";

const controller = new chatController();

const chatRouters = Router();


chatRouters.get("/:userId",controller.getConversations.bind(controller));
chatRouters.get("/get-user/:receiverId",controller.getUser.bind(controller));
chatRouters.get("/get-restaurant/:receiverId",controller.getRestaurant.bind(controller));
chatRouters.get("/get-messages/:selectedChatId",controller.getMessages.bind(controller));
chatRouters.get("/notifications/:userId",controller.getNotifications.bind(controller));
chatRouters.post("/",controller.createNewConversation.bind(controller));
chatRouters.post("/sendMessage",controller.sendMessage.bind(controller));



export default chatRouters;