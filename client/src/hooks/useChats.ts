import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axiosInstance from "../api/axios";
import {
  ConversationType,
  MessageType,
  senderTypingType,
} from "../types/chatTypes";
import { io, Socket } from "socket.io-client";


interface onlineUserFindType {
  userId: string;
}

interface lastMessageType {
  conversationId: string;
  senderId: string;
  text: string;
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
  const [senderTyping, setSenderTyping] = useState<senderTypingType | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const [lastMessage, setLastMessage] = useState<lastMessageType[]>([]);
  const [notifications, setNotifications] = useState<{
    conversationId: string;
    senderId : string
    text:string;
  }[]>([]);

  const socket = useRef<Socket>();
  const scrollRef = useRef<HTMLDivElement>(null);

  
  const receiverId = useMemo(
    () => selectedChat?.members.find((user) => user !== userId),
    [selectedChat, userId]
  );
  useEffect(() => {
    const socketInstance = io(`${import.meta.env.VITE_API_BASE_URL}`);
    socket.current = socketInstance;
    socketInstance.on("getMessage", (data) => {
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
    socketInstance.on("notification", (data) => {
      console.log("Notification received:", data);
      setNotifications((prev)=>[...prev , data])
    });
    return () => {
      socketInstance.off("getMessage");
      socketInstance.off("notification");
      socketInstance.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    const hanldeLableMessageSeen = ({
      conversationId,
    }: {
      conversationId: string;
    }) => {
      
      setConversations((prev) => {
        const updatedConversation = prev.map((conversation) => {
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
        return updatedConversation;
      });
    };

    socket.current?.on("messageSeen", hanldeLableMessageSeen);
    return () => {
      socket.current?.off("messageSeen", hanldeLableMessageSeen);
    };
  }, [socket, setConversations, selectedChat]);

  // useEffect(() => {
  //   arrivalMessage &&
  //     selectedChat?.members.includes(arrivalMessage.sender) &&
  //     setMessages((prev) => [...prev, arrivalMessage]);
     
  //   setArrivalMessage(null);
  // }, [arrivalMessage, selectedChat]);
  useEffect(() => {
    if (arrivalMessage) {
      selectedChat?.members.includes(arrivalMessage.sender) &&
        setMessages((prev) => [...prev, arrivalMessage]);
        if(selectedChat?._id){
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            { 
              conversationId: selectedChat._id,
              senderId : arrivalMessage.sender,
              text:arrivalMessage.text ,
            },
          ]);
        }
    }
    setArrivalMessage(null);
  }, [arrivalMessage, selectedChat]);

  useEffect(() => {
    socket.current?.on("getSenderTyping", (data) => {
      setSenderTyping(data);
    });
  }, [socket]);

  useEffect(() => {
    if (!selectedChat) return;
    const lastMessageIsFromOtherUser =
    messages && messages.length && messages[messages.length - 1].sender !== userId;
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
        setNotifications((prevNotifications) =>
          prevNotifications.filter(
            (notification) => notification.conversationId !== conversationId
          )
        );
        setMessages((prev) =>
          prev.map((message) =>
            message.seen ? message : { ...message, seen: true }
          )
        );  
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

  const sendMessage = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage || !selectedChat) return;

    const message = {
      sender: userId,
      text: newMessage,
      conversationId: selectedChat._id,
    };
    socket.current?.emit("sendMessage", {
      senderId: userId,
      receiverId: receiverId,
      text: newMessage,
      conversationId: selectedChat._id,
    });

    try {
      socket.current?.emit("senderTyping", {
        receiverId: receiverId,
        conversationId: selectedChat?._id,
        status: false,
      });
      socket.current?.emit("sendLastMessage", {
        senderId: userId,
        text: newMessage,
        conversationId: selectedChat?._id,
      });
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
  },[newMessage, selectedChat, userId, receiverId, socket, axiosInstance]);
  
  const handleTyping = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    socket.current?.emit("senderTyping", {
      receiverId: receiverId,
      conversationId: selectedChat?._id,
      status: true,
    });
    setTypingTimeout(
      setTimeout(() => {
        socket.current?.emit("senderTyping", {
          receiverId: receiverId,
          conversationId: selectedChat?._id,
          status: false,
        });
        setTypingTimeout(null);
      }, 2000)
    );
  };

  const handleMessage = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    handleTyping();
    setNewMessage(e.target.value);
  },[]);

  useEffect(() => {
    socket.current?.on("getLastMessage", (data) => {
      setLastMessage(data);
    });
  }, []);

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
    senderTyping,
    handleMessage,
    lastMessage,
    notifications
  };
};

export default useChat;
