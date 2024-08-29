import React, { useEffect, useState, Dispatch, SetStateAction } from "react";
import { PiInfoBold, PiUserCircleDuotone } from "react-icons/pi";
import { BsArrowLeft } from "react-icons/bs";
import axiosInstance from "../../api/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { ConversationType, senderTypingType } from "../../types/chatTypes";
import { format } from "timeago.js";

interface ChatHeaderProps {
  setSelectedChat: Dispatch<SetStateAction<ConversationType | null>>;
  onlineUserId: string | undefined;
  selectedChat: ConversationType;
  senderTyping: senderTypingType | null;
}
type ReceiverType = {
  _id: string;
  username: string;
  restaurantName: string;
  email: string;
};
const ChatHeader: React.FC<ChatHeaderProps> = ({
  setSelectedChat,
  onlineUserId,
  selectedChat,
  senderTyping,
}) => {
  const name = "alan";
  const [receiver, setReceiver] = useState<ReceiverType>({
    _id: "",
    email: "",
    restaurantName: "",
    username: "",
  });
  const { role, id } = useSelector((state: RootState) => state.user);
  const communicatorId = selectedChat.members.find((member) => member !== id);
  console.log(selectedChat);
  useEffect(() => {
    const getCommunicator = async () => {
      try {
        if (role == "seller") {
          const res = await axiosInstance.get(
            "/api/inbox/get-user/" + communicatorId
          );
          setReceiver(res.data.user);
        } else if (role == "user") {
          const response = await axiosInstance.get(
            "/api/inbox/get-restaurant/" + communicatorId
          );
          setReceiver(response.data.restaurant);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCommunicator();
  }, [selectedChat]);

  return (
    <div className="w-full h-[66px] border-b-2  bg-white flex relative">
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
          <h5 className="hidden md:flex">
            {role == "user" ? receiver.restaurantName : receiver.username}
          </h5>
          <span
            className={`text-[13px] text-green-500 font-bold ${
              onlineUserId ? " text-green-500 " : "text-red-400"
            }`}
          >
            {senderTyping &&
            senderTyping.conversationId == selectedChat._id &&
            senderTyping.status ? (
              <p className="text-green-500 font-bold">Typing....</p>
            ) : onlineUserId ? (
              " Online"
            ) : (
              <p>
            {selectedChat?.lastMessage?.createdAt &&
               format(selectedChat.lastMessage.createdAt)
              }
    </p>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(ChatHeader);
