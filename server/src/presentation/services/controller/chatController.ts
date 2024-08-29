import { Request, Response } from "express";
import logger from "../../../infrastructure/lib/Wintson";
import conversationModel from "../../../infrastructure/database/model.ts/conversationModel";
import messageModel from "../../../infrastructure/database/model.ts/messageModel";
import UserModel from "../../../infrastructure/database/model.ts/userModel";
import restaurantModel from "../../../infrastructure/database/model.ts/restaurantModel";
import notificationModel from "../../../infrastructure/database/model.ts/messageNotificationModel";

export class chatController {
  constructor() {}

  async createNewConversation(req: Request, res: Response) {
    const { senderId, receiverId } = req.body;
    try {
      const existingConversation = await conversationModel.findOne({
        members: { $all: [senderId, receiverId] },
      });
      if (existingConversation) {
        return res
          .status(200)
          .json({ savedConversation: existingConversation });
      }
      const newConversation = new conversationModel({
        members: [senderId, receiverId],
      });
      const savedConversation = await newConversation.save();
      return res.status(200).json({ savedConversation: savedConversation });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }

  async getConversations(req: Request, res: Response) {
    const { userId } = req.params;
    try {
      const existingConversations = await conversationModel.find({
        members: { $in: userId },
      });

      return res.status(200).json({ conversations: existingConversations });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }

  async sendMessage(req: Request, res: Response) {
    console.log(req.body);
    const id = req.body.conversationId;
    try {
      const newMessage = new messageModel(req.body);
      const conversation = await conversationModel.findByIdAndUpdate(id, {
        $set: {
          lastMessage: {
            sender: req.body.sender,
            text: req.body.text,
            createdAt: new Date(), 
          },
        },
      },{new : true});
      const savedMessage = await newMessage.save();
      return res.status(200).json({ savedMessage, conversation });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }
  async getUser(req: Request, res: Response) {
    const userId = req.params.receiverId;
    try {
      const user = await UserModel.findById(userId).select("username email");
      return res.status(200).json({ user });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }
  async getRestaurant(req: Request, res: Response) {
    const restaurantId = req.params.receiverId;
    try {
      const restaurant = await restaurantModel
        .findById(restaurantId)
        .select("restaurantName email");
      return res.status(200).json({ restaurant });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }
  async getMessages(req: Request, res: Response) {
    const selectedChatId = req.params.selectedChatId;
    try {
      const messages = await messageModel.find({
        conversationId: selectedChatId,
      });
      return res.status(200).json({ messages });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }
  async getNotifications(req: Request, res: Response) {
    const userId = req.params.userId;
    try {
      const notifications = await notificationModel.find({
        receiverId: userId,
      });
      console.log(notifications);
      return res.status(200).json({ notifications });
    } catch (error) {
      logger.error(
        `Error in create new conversation ${(error as Error).message}`
      );
      return res.status(500).json("Internal server error...");
    }
  }
}
