import React, { useEffect, useState } from "react";
import { PiUserCircleDuotone } from "react-icons/pi";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { ConversationType } from "../../types/chatTypes";
import axiosInstance from "../../api/axios";
import { senderTypingType } from "../../types/chatTypes";
import { format } from "timeago.js";


interface onlineUserFindType {
  userId: string;
}

interface ChatNameListingProps {
  conversation: ConversationType;
  onlineUser: onlineUserFindType[];
  senderTyping: senderTypingType | null;
  notifications: {
    conversationId: string;
    senderId: string;
    text: string;
  }[];
}

type ReceiverType = {
  _id: string;
  username: string;
  restaurantName: string;
  email: string;
};

type unreadMessages = {
  conversationId: string;
  senderId: string;
  text: string;
};

const ChatNamesListing: React.FC<ChatNameListingProps> = React.memo(
  ({ conversation, onlineUser, notifications }) => {
    const { role, id } = useSelector((state: RootState) => state.user);
    const [receiver, setReceiver] = useState<ReceiverType>({
      _id: "",
      email: "",
      restaurantName: "",
      username: "",
    });
    const [unreadMessages, setUnreadMessages] = useState<
      unreadMessages | undefined
    >(undefined);
    const communicatorId = conversation.members.find((m) => m !== id);

    useEffect(() => {
      const getCommunicator = async () => {
        try {
          if (role === "seller") {
            const res = await axiosInstance.get(
              `/api/inbox/get-user/${communicatorId}`
            );
            setReceiver(res.data.user);
          } else if (role === "user") {
            const res = await axiosInstance.get(
              `/api/inbox/get-restaurant/${communicatorId}`
            );
            setReceiver(res.data.restaurant);
          }
        } catch (error) {
          console.log(error);
        }
      };

      getCommunicator();
    }, [conversation, id, role, communicatorId]);

    useEffect(() => {
      const notification = notifications.find(
        (notification) => notification.conversationId === conversation._id
      );
      setUnreadMessages(notification);
    }, [notifications, conversation._id]);
    const isOnline = onlineUser.some(
      (member) => member.userId === receiver._id && member.userId !== id
    );
    return (
      <div className="flex items-center">
        <div className="relative">
          {isOnline && (
            <div className="bg-green-500 h-4 w-4 rounded-lg absolute left-2"></div>
          )}
          <PiUserCircleDuotone className="size-16 md:size-14" />
        </div>
        <div className="ml-3">
          {role === "user" ? (
            <h3 className="text-sm font-semibold">
              {receiver &&
              receiver.restaurantName &&
              receiver.restaurantName.length > 13
                ? `${receiver.restaurantName.substring(0, 13)}...`
                : receiver.restaurantName}
            </h3>
          ) : (
            <h3 className="text-sm font-semibold">
              {receiver && receiver.username && receiver.username.length > 13
                ? `${receiver.username.substring(0, 13)}...`
                : receiver.username}
            </h3>
          )}
          <div className="flex flex-row items-center gap-2">
            {!unreadMessages && conversation?.lastMessage && conversation?.lastMessage.sender == communicatorId &&(
              <p className="text-gray-600 text-sm"> {conversation.lastMessage?.text}</p>
            )}
            {!unreadMessages && conversation?.lastMessage && conversation?.lastMessage.sender !== communicatorId &&(
              <p className="text-gray-700 text-sm">sent : {conversation.lastMessage?.text}</p>
            )}
            {!unreadMessages && conversation?.lastMessage && conversation.lastMessage.createdAt && (
             <p className="text-gray-500 text-xs">{format(conversation.lastMessage.createdAt)}</p>
            )}
            {unreadMessages && (
              <p className="text-black font-bold flex items-center gap-1">
                <div className="bg-red-500 h-2.5 w-2.5 text-xs rounded-full" />
                {unreadMessages && unreadMessages.text}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(ChatNamesListing);
