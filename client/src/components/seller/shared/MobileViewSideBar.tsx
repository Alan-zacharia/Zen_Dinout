import React from 'react'
import { GiHamburgerMenu } from "react-icons/gi";
import { IoLogOut } from "react-icons/io5";
import { SELLER_SIDEBAR_LINKS } from "../../../lib/constants/SellerNavigation";
import { SideBarLinks } from './SideBar';
interface SidebarLink {
  keys : string;
  label: string;
  path: string;
  icon: JSX.Element;
}
const MobileViewSideBar : React.FC = () => {
  
  return (
    <div>
      <div className="drawer lg:hidden">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-5 absolute">
          <label htmlFor="my-drawer" className="btn  drawer-button">
           <GiHamburgerMenu color='black'/>
          </label>
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer" 
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu p-4  min-h-full bg-blue-500 gap-5 rounded-tr-2xl font-semibold text-white pt-40">
         
          { SELLER_SIDEBAR_LINKS.map(
                    (item: SidebarLink, index: number) => (
                       <SideBarLinks key={index} item={item} />
                    )
                )}
          <span className="text-base font-bold">----------------------</span>
          <li className="hover:bg-white hover:text-red-500 hover:rounded-2xl ">
            <a>
              <IoLogOut size={27} />
              Logout
            </a>
          </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MobileViewSideBar
