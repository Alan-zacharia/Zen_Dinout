import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { BsCheck2All } from "react-icons/bs";
import { MessageType } from "../../types/chatTypes";
import { format } from "timeago.js";

interface MessagePropsType {
  messages: MessageType;
}

const ChatMessages: React.FC<MessagePropsType> = React.memo(({ messages }) => {
  const { id } = useSelector((state: RootState) => state.user);

  return (
    <>
      {id === messages.sender ? (
        <div className="max-w-[80%] xl:max-w-[30%] flex flex-col rounded-t-xl p-2 rounded-bl-xl ml-auto bg-gray-300 text-black break-words">
          <p className="px-4">{messages.text}</p>
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-gray-500 px-4">{format(messages.createdAt)}</p>
            <BsCheck2All size={16} className={messages.seen ? "text-blue-500" : "text-gray-500"} />
          </div>
        </div>
      ) : (
        <div className="max-w-[80%] xl:max-w-[30%] flex flex-col rounded-t-xl p-2 rounded-br-xl bg-blue-500 mr-auto text-white break-words">
          <p className="px-4">{messages.text}</p>
          <p className="text-xs text-gray-200 px-4 mt-1">{format(messages.createdAt)}</p>
        </div>
      )}
    </>
  );
});

export default React.memo(ChatMessages);
