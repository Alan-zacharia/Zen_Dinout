import {  HiOutlineUsers } from 'react-icons/hi';
import { MdTableRestaurant , MdDashboard , MdCardMembership } from "react-icons/md";
import { RiCoupon3Fill } from "react-icons/ri";


export const DASHBOARD_SIDEBAR_LINKS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/admin/",
    icon: <MdDashboard />
  },
  {
    key: "customers",
    label: "Customers",
    path: "/admin/customers",
    icon: <HiOutlineUsers />
  },
  {
    key: "restaurants",
    label: "Restaurants",
    path: "/admin/restaurants",
    icon: <MdTableRestaurant />
  },
  
  {
    key: "registerations",
    label: "New Registerations",
    path: "/admin/new-registerations",
    icon: <MdTableRestaurant />
  },
  {
    key: "coupons",
    label: "Copouns",
    path: "/admin/coupons",
    icon: <RiCoupon3Fill />
  },
  {
    key: "membership",
    label: "Memberships",
    path: "/admin/memberships",
    icon: <MdCardMembership />
  },
  
]

  