import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineBell, HiOutlineSearch } from "react-icons/hi";
import {
  Popover,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import classNames from "classnames";

const Header = () => {
  const navigate = useNavigate();
  const { name } = useSelector((state: RootState) => state.user);
  const displayRestaurantName = name?.toLowerCase().includes("restaurant") ? name : `${name} Restaurant`
  return (
    <header className="sticky top-0 bg-white shadow-sm shadow-slate-100  z-50 h-20 flex items-center justify-between  py-5">
      <div className="hidden lg:flex bg-black  w-[192px] h-[90px] absolute"></div>
      <h1 className="lg:px-52 px-5 text-lg lg:text-2xl font-bold font-serif">{displayRestaurantName}</h1>
      <div className="flex items-center space-x-4">
        <div className="relative flex-shrink-0 w-52 hidden sm:flex">
          <HiOutlineSearch
            fontSize={24}
            className="text-gray-400 absolute top-1/2 -translate-y-1/2 left-3"
          />
          <input
            type="text"
            placeholder="Search....."
            className="text-sm focus:outline-none border border-gray-300 h-10 w-full pl-10 pr-4 rounded-sm"
          />
        </div>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-300",
                  "p-1.5 rounded-sm inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineBell fontSize={24} />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-160"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <Popover.Panel className="absolute right-0 w-44 sm:w-72 mt-2.5 z-10">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Notifications
                    </strong>
                    <div className="mt-2 py-1 text-sm">
                      This is the notification panel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="ml-2 inline-flex rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
            <div
              className="h-8 w-8 rounded-full bg-white bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Isolated-HD.png")',
              }}
            ></div>
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate("/admin/settings")}
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2"
                    )}
                  >
                    Settings
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate("/admin/settings")}
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2"
                    )}
                  >
                    Sign out
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;
