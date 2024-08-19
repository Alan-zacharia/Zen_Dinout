import React from "react";

import { IoLogOut } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import classNames from "classnames";
import { SELLER_SIDEBAR_LINKS } from "../../../lib/constants/SellerNavigation";
import axios from "axios";
import { useDispatch } from "react-redux";

import { localStorageRemoveItem } from "../../../utils/localStorageImpl";
import { clearUser } from "../../../redux/user/userSlice";
import logout from "../../../utils/Logout";

interface SidebarLink {
  keys: string;
  label: string;
  path: string;
  icon: JSX.Element;
}

const SideBar = () => {
  const handleLogout = async () => {
    logout("Seller Logout");
  };
  return (
    <div>
      <div className="h-full hidden lg:flex ">
        <div className="flex flex-1">
          <div>
            <ul className="menu  w-48   h-full  bg-black gap-5   font-bold text-base text-white pt-16 ">
              {SELLER_SIDEBAR_LINKS.map((item: SidebarLink, index: number) => (
                <SideBarLinks key={index} item={item} />
              ))}
              <span className="text-base font-bold">
                ----------------------
              </span>
              <li
                className="hover:bg-white hover:text-red-500 hover:rounded-2xl "
                onClick={handleLogout}
              >
                <p>
                  <IoLogOut size={27} />
                  Logout
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;

interface sideBarLinks {
  item: SidebarLink;
}

export const SideBarLinks: React.FC<sideBarLinks> = ({ item }) => {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "hover:bg-white hover:text-black bg-white text-black "
          : "text-white  font-semibold"
      )}
    >
      <li className="hover:bg-white hover:text-black ">
        <a>
          {item.icon} {item.label}
        </a>
      </li>
    </Link>
  );
};
