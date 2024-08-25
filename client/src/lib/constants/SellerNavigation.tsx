import {
  MdDateRange,
  MdOutlineRestaurant,
  MdTableRestaurant,
  MdDashboard,
} from "react-icons/md";
import { LuTimer } from "react-icons/lu";
import { BiFoodMenu } from "react-icons/bi";
import { TiMessages } from "react-icons/ti";

export const SELLER_SIDEBAR_LINKS = [
  {
    keys: "dashboard",
    label: "Dashboard",
    path: "/restaurant/",
    icon: <MdDashboard size={27} />,
  },
  {
    keys: "reservations",
    label: "Reservations",
    path: "/restaurant/reservations",
    icon: <MdDateRange size={27} />,
  },
  {
    keys: "table",
    label: "Tables",
    path: "/restaurant/table",
    icon: <MdTableRestaurant size={27} />,
  },
  {
    keys: "time",
    label: "Time slots",
    path: "/restaurant/time-slots",
    icon: <LuTimer size={27} />,
  },
  {
    keys: "menu",
    label: "Menu",
    path: "/restaurant/menu",
    icon: <BiFoodMenu size={27} />,
  },
  {
    keys: "restaurant",
    label: "Restaurant",
    path: "/restaurant/profile",
    icon: <MdOutlineRestaurant size={27} />,
  },
  {
    keys: "messages",
    label: "Messages",
    path: "/restaurant/chat",
    icon: <TiMessages size={27} />,
  },
];
