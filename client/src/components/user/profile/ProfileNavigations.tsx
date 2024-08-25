import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  RiLogoutBoxRFill,
  RiCoupon2Fill,
  RiChatHistoryFill,
} from "react-icons/ri";
import { FaWallet, FaUserCircle, FaBookmark, FaUserAlt } from "react-icons/fa";
import logout from "../../../utils/Logout";
import { ProfileNavigationProps } from "../../../types/user/userTypes";
import { IoIosNavigate } from "react-icons/io";

const ProfileNavigations: React.FC<ProfileNavigationProps> = ({
  userDetails,
}) => {
  const [navigationChange, setNavigationChange] = useState<string>("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleNavigation = (navigation: string) => {
    navigate(`/account/?list_name=${navigation}`);
    setNavigationChange(navigation);
    setIsSidebarOpen(false);
  };

  const handleClick = () => {
    logout("Logout Successful..");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button
        className="lg:hidden p-4 absolute top-5 left-0 tooltip tooltip-primary "
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
        data-tip="Side bar"
      >
        <IoIosNavigate size={20} />
      </button>
      <nav
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed inset-y-0 left-0 z-50 lg:z-0 w-64 lg:h-[430px] lg:w-1/3 lg:relative bg-white shadow-xl shadow-neutral-300 p-6 rounded-lg transition-transform transform lg:translate-x-0`}
      >
        <header className="flex items-center gap-6 px-2">
          <FaUserAlt
            size={30}
            className="cursor-pointer rounded border border-black"
          />
          <div className="text-sm font-normal">
            <p>Hello,</p>
            <p className="text-sm font-bold">
              {userDetails?.username && userDetails?.username.length > 15
                ? userDetails?.username.substring(0, 15) + "..."
                : userDetails?.username}
            </p>
          </div>
        </header>

        <div className="mt-6">
          <ul className="flex flex-col gap-4 text-sm font-semibold">
            <li
              className={`nav-item p-2 rounded-2xl cursor-pointer flex items-center ${
                navigationChange === "profile"
                  ? "bg-gray-200 text-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleNavigation("profile")}
            >
              <FaUserCircle size={20} /> &nbsp; Profile Details
            </li>
            <li
              className={`nav-item p-2 rounded-2xl cursor-pointer flex items-center ${
                navigationChange === "bookings"
                  ? "bg-gray-200 text-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleNavigation("bookings")}
            >
              <RiChatHistoryFill size={21} /> &nbsp; Booking History
            </li>
            <li
              className={`nav-item p-2 rounded-2xl cursor-pointer flex items-center ${
                navigationChange === "bookmarks"
                  ? "bg-gray-200 text-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleNavigation("bookmarks")}
            >
              <FaBookmark size={20} /> &nbsp; Bookmarks
            </li>
            <li
              className={`nav-item p-2 rounded-2xl cursor-pointer flex items-center ${
                navigationChange === "Wallet"
                  ? "bg-gray-200 text-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleNavigation("Wallet")}
            >
              <FaWallet size={20} /> &nbsp; Wallet
            </li>
            <li
              className={`nav-item p-2 rounded-2xl cursor-pointer flex items-center ${
                navigationChange === "Coupons"
                  ? "bg-gray-200 text-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleNavigation("Coupons")}
            >
              <RiCoupon2Fill size={20} /> &nbsp; Coupons
            </li>

            <li
              className="nav-item p-2 rounded-2xl cursor-pointer flex items-center hover:bg-red-400 hover:text-white"
              onClick={handleClick}
            >
              <RiLogoutBoxRFill size={20} className="hover:text-red-600" />{" "}
              Logout
            </li>
          </ul>
        </div>
      </nav>

      {/* Overlay to close sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default ProfileNavigations;
