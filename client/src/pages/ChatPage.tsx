import React, { useCallback, useEffect, useMemo, useState } from "react";
import ChatIcon from "../assets/chat-chat-svgrepo-com.svg";
import ChatSideBar from "../components/chat/ChatSideBar";
import ChatNamesListing from "../components/chat/ChatNamesListing";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ChatMobileViewSlide from "../components/chat/ChatMobileViewSlider";
import ChatMessages from "../components/chat/ChatMessages";
import ChatHeader from "../components/chat/ChatHeader";
import { IoHome } from "react-icons/io5";
import { PiUserCircleDuotone } from "react-icons/pi";
import { BsArrowLeft } from "react-icons/bs";
import { useSearchParams } from "react-router-dom";
import { ConversationType } from "../types/chatTypes";
import useChat from "../hooks/useChats";

const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const { name, id } = useSelector((state: RootState) => state.user);
  const [selectedChat, setSelectedChat] = useState<ConversationType | null>(
    null
  );
  const {
    conversations,
    loadingConversations,
    messages,
    newMessage,
    scrollRef,
    sendMessage,
    setNewMessage,
    onlineUser,
    receiverId,
    senderTyping,
    handleMessage,
    notifications,
  } = useChat(id as string, selectedChat);

  useEffect(() => {
    if (conversationId) {
      const selectedChat = conversations.find(
        (chat) => chat._id === conversationId
      );
      if (selectedChat) {
        setSelectedChat(selectedChat);
      }
    }
    window.history.replaceState({}, "", window.location.pathname);
  }, [conversationId, conversations]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aLastMessageDate = new Date(a.lastMessage.createdAt as string).getTime();
      const bLastMessageDate = new Date(b.lastMessage.createdAt as string).getTime();
      return bLastMessageDate - aLastMessageDate;
    });
  }, [conversations]);
  
 
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const onlineUserId = onlineUser.find((user) => user.userId == receiverId);
  const renderConversation = useCallback(
    (c: ConversationType) => (
      <div
        className={`flex items-center p-1 px-4 md:p-2 md:px-8 cursor-pointer relative hover:bg-slate-50`}
        key={c._id}
        onClick={() => setSelectedChat(c)}
      >
        <ChatNamesListing
          conversation={c}
          onlineUser={onlineUser}
          senderTyping={senderTyping}
          notifications={notifications}
        />
      </div>
    ),
    [onlineUser, senderTyping, notifications , conversations]
  );


  return (
    <div className="flex h-screen">
      <ChatSideBar />
      <section className="hidden w-full md:w-[300px] shadow-sm border-r border-l border-gray-200 md:flex flex-col relative ">
        {loadingConversations && (
          <div>
            <div className="mb-5 mt-5">
              <div className="px-7 flex w-52 flex-col gap-4">
                <div className="flex items-center gap-2 ">
                  <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-32"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="skeleton h-0.5 w-full"></div>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((_, i) => (
              <div className="px-7 p-4 flex w-full flex-col gap-4" key={i}>
                <div className="flex items-center gap-4">
                  <div className="skeleton h-12 w-12 shrink-0 rounded-full"></div>
                  <div className="flex flex-col gap-4">
                    <div className="skeleton h-4 w-32"></div>
                    <div className="skeleton h-4 w-44"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {!loadingConversations && (
          <>
            <div className="sticky top-0 bg-white z-10 md:relative">
              <div className="text-base font-bold p-2 px-4 md:px-10  md:border-b flex gap-5 items-center">
                <BsArrowLeft
                  size={27}
                  className="md:hidden text-black flex mr-auto"
                />
                <div className="flex gap-2">
                  <PiUserCircleDuotone className="size-10 md:size-12" />
                  {name && (
                    <p className="px-1 pt-2">
                      {name.length > 13 ? name.substring(0, 13) : name}
                      <span>{name.length > 13 && <span>...</span>}</span>
                    </p>
                  )}
                </div>
                <div className="flex md:hidden ml-auto">
                  <IoHome />
                </div>
              </div>
            </div>
            <hr className="hidden md:flex" />
            <div className="overflow-y-scroll overflow-x-hidden no-scrollbar pb-3">
              <div className="flex items-center md:my-6 mx-5 mb-2 md:mx-10">
                <h3 className="text-[15px] font-bold text-black">Messages</h3>
              </div>
              {sortedConversations.map(renderConversation)}
            </div>
          </>
        )}
      </section>
      {!selectedChat && <ChatMobileViewSlide />}
      <section className="hidden flex-1 md:flex flex-col bg-neutral-50 relative w-0">
        {!selectedChat && (
          <div className=" absolute md:flex md:flex-col items-center top-[30%] right-[45%] text-center text-gray-400 p-6">
            <img
              src={ChatIcon}
              alt="Chat Icon"
              className="w-52 h-52 opacity-85 mb-4"
            />
            <div className="text-lg font-bold">Your messages.</div>
            <div className="text-sm">Open a conversation to start a chat.</div>
          </div>
        )}
        {selectedChat && (
          <>
            <ChatHeader
              onlineUserId={onlineUserId?.userId}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              senderTyping={senderTyping}
            />

            <div className="flex-1 overflow-y-auto p-5  no-scrollbar">
              {messages.map((m, index: number) => (
                <div className="flex flex-col gap-4 mt-2" ref={scrollRef}>
                  <ChatMessages messages={m} key={index} />
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage}>
              <div className="flex items-center p-3 bg-white border-t border-gray-200">
                <input
                  placeholder="Message..."
                  className="flex-1 p-3 border border-gray-400 shadow-lg rounded-full bg-light outline-none pr-16"
                  value={newMessage}
                  onChange={handleMessage}
                />
                <button
                  className="absolute right-8 text-orange-500"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        )}
      </section>
      {selectedChat && (
        <section className="flex flex-1 md:hidden flex-col bg-neutral-50 relative">
          <form onSubmit={sendMessage}>
            <div className="flex items-center p-3 bg-white border-t border-gray-200">
              <input
                placeholder="Message..."
                className="flex-1 p-3 border border-gray-400 shadow-lg rounded-full bg-light outline-none pr-16"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="absolute right-8 text-orange-500"
                type="submit"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}
    </div>
  );
};

export default ChatPage;

