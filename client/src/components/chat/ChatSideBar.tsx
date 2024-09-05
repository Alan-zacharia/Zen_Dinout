import React from "react";
import { Link } from "react-router-dom";
import { IoHome, IoLogOut } from "react-icons/io5";
import { RiFolderUserFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import  logout  from "../../utils/Logout";

const ChatSideBar: React.FC = () => {
  const { role } = useSelector((state: RootState) => state.user);

  return (
    <div className="hidden md:flex flex-col items-center p-3 mt-6 w-20 bg-white">
      <div className="hover:bg-slate-200 rounded-lg w-14 h-14 tooltip flex items-center justify-center">
        <span className="text-black font-extrabold text-2xl cursor-pointer">
          Z
        </span>
        <span className="text-orange-500 font-extrabold text-2xl cursor-pointer">
          D
        </span>
      </div>
      <ul className="pt-10 text-2xl cursor-pointer flex flex-col gap-5 items-center">
        <Link to={role == "seller" ? "/restaurant" : "/"}>
          <li
            className="hover:bg-slate-200 rounded-lg w-14 h-14 p-4 tooltip"
            data-tip="Home"
          >
            <IoHome />
          </li>
        </Link>

        <Link to={role == "seller" ? "/restaurant/profile" : "/"}>
          <li
            className="hover:bg-slate-200 rounded-lg w-14 h-14 p-4 tooltip"
            data-tip="Profile"
          >
            <RiFolderUserFill />
          </li>
        </Link>
      </ul>
      <div
        className="mt-auto p-4 hover:bg-slate-200 rounded-lg w-14 h-14 tooltip cursor-pointer"
        data-tip="Logout"
        onClick={() => logout("Logout successfully...")}
      >
        <IoLogOut size={25} className="text-red-500" />
      </div>
    </div>
  );
};

export default ChatSideBar;
