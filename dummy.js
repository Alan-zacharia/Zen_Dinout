 {/* <div className="w-full h-[66px] border-b-2  bg-white flex relative">
              <div className="p-3  flex items-center gap-2 font-bold">
                <PiUserCircleDuotone className="hidden md:flex size-10" />
                <div className="md:hidden  p-3 flex items-center gap-3 font-bold ">
                  <BsArrowLeft
                    size={25}
                    className="md:hidden text-black mr-5"
                    onClick={() => setSelectedChat(null)}
                  />
                  <PiUserCircleDuotone className="size-8 " />
                  <h5 className="text-sm">{name}</h5>
                  <PiInfoBold size={20} className="absolute right-6" />
                </div>
                <div className="flex flex-col">
                <h5 className="hidden md:flex">{name}</h5>
                <span className={ `text-[13px] text-green-500 font-bold ${onlineUserId ? " text-green-500 " : "text-red-400"}`}>{onlineUserId ? " Online" : "offline"}</span>
                </div>
              </div>
            </div> */}


            import { FormEvent, useEffect, useRef, useState } from "react";
import axiosInstance from "../api/axios";
import { ConversationType, MessageType } from "../types/chatTypes";
import { io, Socket } from "socket.io-client";

interface onlineUserFindType {
  userId: string;
}

const useChat = (userId: string, selectedChat: ConversationType | null) => {
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [loadingConversations, setLoadingConversations] =
    useState<boolean>(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [onlineUser, setOnlineUser] = useState<onlineUserFindType[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [arrivalMessage, setArrivalMessage] = useState<MessageType | null>(
    null
  );

  const socket = useRef<Socket>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const receiverId = selectedChat?.members.find((user) => user !== userId);
  useEffect(() => {
    socket.current = io(`${import.meta.env.VITE_API_BASE_URL}`);
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
      setConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id == selectedChat?._id) {
            return {
              ...conversation,
              lastMessage: {
                text: data.text,
                sender: data.senderId,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      selectedChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, selectedChat]);

  useEffect(() => {
    if (!selectedChat) return;
    const lastMessageIsFromOtherUser =
      messages.length && messages[messages.length - 1].sender !== userId;
    if (lastMessageIsFromOtherUser) {
      socket.current?.emit("markMessageAsSeen", {
        conversationId: selectedChat._id,
        userId: receiverId,
      });
    }

    const handleMessageSeen = ({
      conversationId,
    }: {
      conversationId: string;
    }) => {
      if (selectedChat?._id === conversationId) {
        setMessages((prev) =>
          prev.map((message) =>
            message.seen ? message : { ...message, seen: true }
          )
        );
        setConversations((prev) => {
          const updatedConversations = prev.map((conversation) => {
            if (conversation._id === conversationId) {
              return {
                ...conversation,
                lastMessage: {
                  ...conversation.lastMessage,
                  seen: true,
                },
              };
            }
            return conversation;
          });
          return updatedConversations;
        });
      }
    };
    socket.current?.on("messageSeen", handleMessageSeen);
    return () => {
      socket.current?.off("messageSeen", handleMessageSeen);
    };
  }, [messages, selectedChat, userId, receiverId]);

  useEffect(() => {
    socket.current?.emit("addUser", userId);
    socket.current?.on("getUsers", (users) => {
      setOnlineUser(users);
    });
  }, [userId]);

  useEffect(() => {
    const fetchConversations = async () => {
      setLoadingConversations(true);
      try {
        const res = await axiosInstance.get(`/api/inbox/${userId}`);
        setConversations(res.data.conversations);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchConversations();
  }, [userId]);

  useEffect(() => {
    if (!selectedChat) return;

    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/inbox/get-messages/${selectedChat._id}`
        );
        console.log(res.data.messages);
        setMessages(res.data.messages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, [selectedChat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage || !selectedChat) return;

    const message = {
      sender: userId,
      text: newMessage,
      conversationId: selectedChat._id,
    };
    console.log(receiverId);
    socket.current?.emit("sendMessage", {
      senderId: userId,
      receiverId: receiverId,
      text: newMessage,
    });

    try {
      const res = await axiosInstance.post("/api/inbox/sendMessage", message);
      setMessages((prevMessages) => [...prevMessages, res.data.savedMessage]);
      setConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
          if (conversation._id == selectedChat?._id) {
            return {
              ...conversation,
              lastMessage: {
                text: newMessage,
                sender: userId,
              },
            };
          }
          return conversation;
        });
        return updatedConversation;
      });
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    conversations,
    loadingConversations,
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
    scrollRef,
    onlineUser,
    receiverId,
  };
};

export default useChat;
