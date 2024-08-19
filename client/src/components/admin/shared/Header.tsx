import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  Transition,
} from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiOutlineBell, HiOutlineChatAlt } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

interface HeadeProps {
  handleChange: () => void;
  menu: boolean;
}
const Header: React.FC<HeadeProps> = ({ handleChange, menu }) => {
  const navigate = useNavigate();
  return (
    <div className="relative bg-white h-16 lg:px-4 flex justify-between items-center border-b border-gray-300">
      {!menu && (
        <div className=" lg:hidden absolute left-8 top-5 z-10">
          <GiHamburgerMenu size={25} onClick={handleChange} />
        </div>
      )}
      <div className="relative flex-shrink-0 h-44 w-52 md:w-auto" />
      <div className="flex items-center gap-4 mr-2">
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-300",
                  "p-1.5 rounded-sm  inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
                )}
              >
                <HiOutlineChatAlt fontSize={24} />
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
                <Popover.Panel className="absolute right-0 w-80 mt-2.5 z-10 ">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Messages
                    </strong>
                    <div className="mt-2 py-1  text-sm">
                      This is messages panel
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <Popover.Button
                className={classNames(
                  open && "bg-gray-300",
                  "p-1.5 rounded-sm  inline-flex items-center text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100"
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
                <Popover.Panel className="absolute right-0 w-80 mt-2.5 z-10 ">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">
                      Notifications
                    </strong>
                    <div className="mt-2 py-1  text-sm">
                      This is notification panel
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
            <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-36 rounded-sm shadow-md p-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none ">
              <MenuItem>
                {({ active }) => (
                  <div
                    onClick={() => navigate("/admin/settings")}
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2 "
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
    </div>
  );
};

export default Header;
