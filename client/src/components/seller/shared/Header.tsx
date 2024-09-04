import { Fragment } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import classNames from "classnames";
import logout from "../../../utils/Logout";

const Header = () => {
  const { name } = useSelector((state: RootState) => state.user);
  const displayRestaurantName = name?.toLowerCase().includes("restaurant")
    ? name
    : `${name} Restaurant`;
  return (
    <header className="sticky top-0 bg-white shadow-sm shadow-slate-100  z-50 h-20 flex items-center justify-between  py-5">
      <div className="hidden lg:flex bg-black  w-[192px] h-[90px] absolute"></div>
      <h1 className="lg:px-52 px-5 text-lg lg:text-2xl font-bold font-serif">
        {displayRestaurantName}
      </h1>
      <div className="flex items-center space-x-4 pr-5" >
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
                    onClick={() => logout("Logout successfully...")}
                    className={classNames(
                      active && "bg-gray-100",
                      "text-red-700 focus:bg-gray-200 block cursor-pointer rounded-sm px-4 py-2"
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
