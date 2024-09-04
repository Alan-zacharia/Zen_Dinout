import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import classNames from "classnames";
import { Fragment } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import logout from "../../../utils/Logout";

interface HeadeProps {
  handleChange: () => void;
  menu: boolean;
}
const Header: React.FC<HeadeProps> = ({ handleChange, menu }) => {
  return (
    <div className="relative bg-white h-16 lg:px-4 flex justify-between items-center border-b border-gray-300">
      {!menu && (
        <div className=" lg:hidden absolute left-8 top-5 z-10">
          <GiHamburgerMenu size={25} onClick={handleChange} />
        </div>
      )}
      <div className="relative flex-shrink-0 h-44 w-52 md:w-auto" />
      <div className="flex items-center gap-4 mr-2">
        <Menu as="div" className="relative inline-block text-left">
          <MenuButton className="flex items-center space-x-2 rounded-full p-2 focus:outline-none focus:ring-2 ">
            <div
              className="h-8 w-8 rounded-full bg-white bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://www.pngmart.com/files/21/Admin-Profile-Vector-PNG-Isolated-HD.png")',
              }}
            ></div>
            <span className="text-gray-900 font-medium">ADMIN</span>
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
                    onClick={() => logout("Logout succefull..")}
                    className={classNames(
                      active && "bg-gray-100",
                      "text-gray-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2 "
                    )}
                  >
                    Logout
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
