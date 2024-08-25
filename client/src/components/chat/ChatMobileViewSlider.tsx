import React from "react";
import { IoHome } from "react-icons/io5";

import { PiUserCircleDuotone } from "react-icons/pi";
import { BsArrowLeft } from "react-icons/bs";

import { useAppDispatch } from "../../redux/store";
import { setCurrentChat } from "../../redux/chat/currentChatSLice";

const ChatMobileViewSlide: React.FC = () => {
  const name = "Ammu";
  const dispatch = useAppDispatch();
  return (
    <section className=" w-full md:w-[300px] shadow-sm border-r border-gray-200 flex flex-col relative md:hidden">
      <div className="sticky top-0 bg-white z-10 md:relative">
        <div className="text-base font-bold p-3 px-4 md:px-10 lg:p-10 md:border-b flex gap-5 items-center">
          <BsArrowLeft
            size={27}
            className="md:hidden text-black flex mr-auto"
          />
          <div className="flex gap-2">
            <PiUserCircleDuotone className="size-10 md:size-12" />
            <p className="px-1 pt-2">
              {name && name.length > 13 ? name.substring(0, 13) : name}
              <span>{name && name.length > 13 && <span>...</span>}</span>
            </p>
          </div>
          <div className="flex md:hidden ml-auto">
            <IoHome />
          </div>
        </div>
        <div className="flex items-center md:my-6 mx-5 mb-2 md:mx-10">
          <h3 className="text-[15px] font-bold text-black">Messages</h3>
        </div>
      </div>
      <hr className="hidden md:flex" />
      <div className="overflow-y-scroll overflow-x-hidden no-scrollbar pb-3">
        {[
          1, 2, 3, 4, 5, 6, 7, 3, 34, 234, 234, 324, 324, 324, 212, 43, 234,
          234, 223, 23,
        ].map((_, index) => (
          <div
            key={index}
            className="flex items-center hover:bg-slate-100 p-1 px-4 md:p-3.5 md:px-8 cursor-pointer relative"
            onClick={() => dispatch(setCurrentChat(true))}
          >
            <div className="flex items-center">
              <div>
                <PiUserCircleDuotone className="size-16 md:size-12" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold">
                  {name &&name.length > 13 ? name.substring(0, 13) : name}
                  {name && name.length > 13 && <span>...</span>}
                </h3>
                <p className="text-sm w-[500px]">you have a message</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChatMobileViewSlide;
