import React from "react";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";

import {
  DASHBOARD_SIDEBAR_LINKS,
} from "../../../lib/constants/Navigation";
import LogoutButton from "./LogoutButton";
import logo from "../../../assets/ZD-logo.jpg";
import { AiOutlineClose } from "react-icons/ai";

interface SidebarLink {
  label: string;
  path: string;
  icon: JSX.Element;
}

interface SidebarProps {
  menu: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, onClose }) => {
  return (
    <>
      <div
        className="lg:flex flex-col w-64 p-3 pt-5  text-white hidden  "
        style={{
          backgroundImage: "url(https://wallpapercave.com/wp/wp4480225.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="flex items-center gap-2 px-4 pb-7 pt-7 py-3">
          <img src={logo} alt="" className="w-5 h-5 " />
          <Link to={"/admin/"}>
            <div className="text-2xl font-bold ">
              Zen<span className="text-orange-600"> Dinout</span>
            </div>
          </Link>
        </div>
        <div className="h-[0.3px] w-full  bg-neutral-300" />
        <div className=" flex flex-col gap-4 py-8">
          {DASHBOARD_SIDEBAR_LINKS.map((item: SidebarLink, index: number) => (
            <SideBarLinks key={index} item={item} onClose={onClose} />
          ))}
        </div>
        <div className="pt-2 flex-1 flex flex-col  gap-0.5 border-t"></div>

        <LogoutButton />
      </div>

      <div
        className={classNames(
          "flex lg:hidden flex-col w-64 p-3 pt-5 text-white fixed top-0 left-0 h-full z-50 transition-all duration-300",
          {
            "translate-x-0": menu,
            "-translate-x-full": !menu,
          }
        )}
        style={{
          backgroundImage: "url(https://wallpapercave.com/wp/wp4480225.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <div className="flex items-center gap-2 px-4 pb-7 pt-7 py-3">
          <img src={logo} alt="" className="w-5 h-5 " />
          <Link to={"/admin/"}>
            <div className="text-2xl font-bold ">
              Zen<span className="text-orange-600"> Dinout</span>
            </div>
          </Link>
        </div>
        <div className="h-[0.3px] w-full bg-neutral-300" />
        <div className="flex flex-col gap-4 py-8">
          {DASHBOARD_SIDEBAR_LINKS.map((item: SidebarLink, index: number) => (
            <SideBarLinks key={index} item={item} onClose={onClose} />
          ))}
        </div>

        <LogoutButton />
        <button
          className="fixed top-4 right-4 text-white z-50"
          onClick={onClose}
        >
          <AiOutlineClose size={20} />
        </button>
      </div>
    </>
  );
};

export default Sidebar;

interface SideBarLinksProps {
  item: SidebarLink;
  onClose: () => void;
}
const SideBarLinks: React.FC<SideBarLinksProps> = ({ item, onClose }) => {
  const { pathname } = useLocation();
  return (
    <Link
      to={item.path}
      className={classNames(
        "flex items-center gap-2 px-3 py-3 rounded-xs text-base hover:no-underline rounded-sm text-white transition duration-500",
        {
          "font-medium bg-cyan-500 active:bg-cyan-500 transition duration-700":
            pathname === item.path,
          "font-semibold hover:bg-gray-500": pathname !== item.path,
        }
      )}
      onClick={() => onClose()}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
};
