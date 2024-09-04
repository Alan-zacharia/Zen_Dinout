import { Server } from "socket.io";
import messageModel from "../infrastructure/database/model/messageModel";
interface SocketUsersType {
  userId: string;
  socketId: string;
}

const socketConfig = (io: Server) => {
  let users: SocketUsersType[] = [];
  const addUser = (userId: string, socketId: string) => {
    !users.some((user) => user.userId === userId) &&
      users.push({ userId, socketId });
  };
  const removeUser = (socketId: string) => {
    users = users.filter((user) => user.socketId !== socketId);
  };
  const getUser = (userId: string) => {
    return users.find((user) => user.userId == userId);
  };
  io.on("connection", (socket) => {
    console.log("A user connected 😃");

    socket.on("addUser", (userId) => {
      addUser(userId, socket.id);
      io.emit("getUsers", users);
    });
    socket.on(
      "sendMessage",
      ({ senderId, receiverId, text, conversationId }) => {
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
      }
    );
    socket.on("senderTyping", ({ receiverId, conversationId, status }) => {
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
      const user = getUser(senderId);
      if (user) {
        io.to(user.socketId).emit("getLastMessage", {
          conversationId,
          senderId,
          text,
        });
      }
    });
    socket.on("markMessageAsSeen", async ({ conversationId, userId }) => {
      try {
        await messageModel.updateMany(
          { conversationId: conversationId, sender: userId, seen: false },
          { $set: { seen: true } }
        );
        const user = getUser(userId);
        if (user) {
          io.to(user?.socketId).emit("messageSeen", { conversationId });
        }
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected 🚶‍♂️");
      removeUser(socket.id);
      io.emit("getUsers", users);
    });
  });
};

export default socketConfig;
