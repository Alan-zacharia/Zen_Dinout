// import React, { useEffect, useState, useRef } from "react";
// import { PiUserCircleDuotone } from "react-icons/pi";
// import { RootState } from "../../redux/store";
// import { useSelector } from "react-redux";
// import { ConversationType, MessageType } from "../../types/chatTypes";
// import axiosInstance from "../../api/axios";
// import { notificationType, senderTyping } from "../../types/chatTypes";
// import { io, Socket } from "socket.io-client";

// interface onlineUserFindType {
//   userId: string;
// }
// interface lastMessageType {
//   conversationId: string;
//   senderId: string;
//   text: string;
// }

// interface ChatNameListingProps {
//   conversation: ConversationType;
//   onlineUser: onlineUserFindType[];
//   senderTyping: senderTyping | null;
//   notification : lastMessageType[]
// }
// type ReceiverType = {
//   _id: string;
//   username: string;
//   restaurantName: string;
//   email: string;
// };
// const ChatNamesListing: React.FC<ChatNameListingProps> = ({
//   conversation,
//   onlineUser,
//   senderTyping,
//   notification
// }) => {

//   const { role, id } = useSelector((state: RootState) => state.user);
//   const [receiver, setReceiver] = useState<ReceiverType>({
//     _id: "",
//     email: "",
//     restaurantName: "",
//     username: "",
//   });

//   const communicatorId = conversation.members.find((m) => m !== id);
//   useEffect(() => {
//     const getCommunicator = async () => {
//       try {
//         if (role == "seller") {
//           const res = await axiosInstance.get(
//             "/api/inbox/get-user/" + communicatorId
//           );
//           setReceiver(res.data.user);
//         } else if (role == "user") {
//           const response = await axiosInstance.get(
//             "/api/inbox/get-restaurant/" + communicatorId
//           );
//           setReceiver(response.data.restaurant);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     getCommunicator();
//   }, [conversation, id]);
//   const onlineuserId = onlineUser.find(
//     (member) => member.userId == receiver._id && member.userId !== id
//   );

//    const notifi =  notification.find(not => not.conversationId == conversation._id) ? "You have a message" : "No messages.."

//   return (
//     <>
//       <div className="flex items-center">
//         <div className="relative">
//           {onlineuserId?.userId == communicatorId && (
//             <div className="bg-green-500 h-4 w-4 rounded-lg absolute left-2"></div>
//           )}
//           <PiUserCircleDuotone className="size-16 md:size-14" />
//         </div>
//         <div className="ml-3">
//           {role === "user" ? (
//             <h3 className="text-sm font-semibold">
//               {receiver.restaurantName.length > 13
//                 ? receiver.restaurantName.substring(0, 13)
//                 : receiver.restaurantName}
//               {receiver.restaurantName.length > 13 && <span>...</span>}
//             </h3>
//           ) : (
//             <h3 className="text-sm font-semibold">
//               {receiver.username.length > 13
//                 ? receiver.username.substring(0, 13)
//                 : receiver.username}
//               {receiver.username.length > 13 && <span>...</span>}
//             </h3>
//           )}
//           <div className="flex flex-row items-center gap-2">
//             {notifi  && (
//               <p className="text-black font-bold text-sm">{notifi}  </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ChatNamesListing;
import React, { useEffect, useState } from "react";
import { PiUserCircleDuotone } from "react-icons/pi";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { ConversationType, MessageType } from "../../types/chatTypes";
import axiosInstance from "../../api/axios";
import { senderTypingType } from "../../types/chatTypes";

interface onlineUserFindType {
  userId: string;
}
interface lastMessageType {
  conversationId: string;
  senderId: string;
  text: string;
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

const ChatNamesListing: React.FC<ChatNameListingProps> = React.memo(
  ({ conversation, onlineUser, senderTyping, notifications }) => {
    const { role, id } = useSelector((state: RootState) => state.user);
    const [receiver, setReceiver] = useState<ReceiverType>({
      _id: "",
      email: "",
      restaurantName: "",
      username: "",
    });

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

    const onlineUserId = onlineUser.find(
      (member) => member.userId === receiver._id && member.userId !== id
    );
    const unreadMessages = notifications.find(
      (notification) => notification.conversationId === conversation._id
    );
    return (
      <div className="flex items-center">
        <div className="relative">
          {onlineUserId?.userId === communicatorId && (
            <div className="bg-green-500 h-4 w-4 rounded-lg absolute left-2"></div>
          )}
          <PiUserCircleDuotone className="size-16 md:size-14" />
        </div>
        <div className="ml-3">
          {role === "user" ? (
            <h3 className="text-sm font-semibold">
              {receiver.restaurantName.length > 13
                ? `${receiver.restaurantName.substring(0, 13)}...`
                : receiver.restaurantName}
            </h3>
          ) : (
            <h3 className="text-sm font-semibold">
              {receiver.username.length > 13
                ? `${receiver.username.substring(0, 13)}...`
                : receiver.username}
            </h3>
          )}
          <div className="flex flex-row items-center gap-2">
            {unreadMessages &&
              unreadMessages.conversationId == conversation._id && (
                <p className="text-black font-bold flex items-center gap-1">
                  <div className="bg-red-500 h-2.5 w-2.5 text-xs rounded-full" />
                  New message..
                </p>
              )}
          </div>
        </div>
      </div>
    );
  }
);

export default React.memo(ChatNamesListing);
