import React from "react";
import NavLeftSide from "./NavLeftSide";
import { Link, useLocation } from "react-router-dom";
import SignOutButton from "../../auth/SignOutButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { FaUserAlt } from "react-icons/fa";

const NavBar: React.FC = () => {
  const { isAuthenticated, role, name } = useSelector(
    (state: RootState) => state.user
  );
  const location = useLocation();
  return (
    <div className="navbar bg-base-100 shadow-sm shadow-neutral-300 h-20">
      <div className="navbar-start ">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content pb-5 z-50 p-2 mt-4 shadow bg-base-100  w-56 "
          >
            {isAuthenticated && role == "user" && (
              <Link to={"/account"}>
                {" "}
                <div className="avatar cursor-pointer flex gap-5 m-6 text-sm">
                  <FaUserAlt size={22} className="cursor-pointer " />
                  {name && role == "user" && (
                    <p className=" font-bold">
                      {name?.length > 14
                        ? name?.substring(0, 14) + "...."
                        : name}
                    </p>
                  )}
                </div>
              </Link>
            )}
            <li className="m-3">
              <Link to={"/"}>
                <p className={location.pathname =="/" ? "text-green-500 font-bold" : "font-bold"}>Home</p>
              </Link>
            </li>
            <li className="m-3">
              <Link to={"/all-restaurants"}>
                <p className={location.pathname =="/all-restaurants" ? "text-green-500 font-bold" : "font-bold"}>Book a Table</p>
              </Link>
            </li>
            <li className="m-3">
            <Link to={"/About"}>
                <p className={location.pathname =="/About" ? "text-green-500 font-bold" : "font-bold"}>About</p>
              </Link>
            </li>

            <li className="m-3">
              <p className=" font-bold">Help</p>
            </li>
            {isAuthenticated && role == "user" && (
              <li>
              <SignOutButton />
            </li>
            )}
          </ul>
        </div>
        <div className=" xl:px-80 text-3xl font-bold flex items-center">
          <Link to={"/"}>
            <div className="">
              Zen<span className="text-orange-600">Dinout</span>
            </div>
          </Link>
          <div className="hidden md:flex">
            <NavLeftSide />
          </div>
        </div>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu-horizontal px-1 font-semibold text-base gap-20 cursor-pointer ">
          <li
            className={`${
              location.pathname === "/" ? "text-red-500" : "hover:text-red-500"
            } transition-colors duration-300`}
          >
            <Link to={"/"}>Home</Link>
            <hr
              className={`${
                location.pathname === "/" ? "border-red-500 " : ""
              } transition-all duration-500`}
            />
          </li>
          <li
            className={`${
              location.pathname === "/all-restaurants"
                ? "text-red-500"
                : "hover:text-red-500"
            } transition-colors duration-300`}
          >
            <Link to="/all-restaurants">Book a Table</Link>
            <hr
              className={`${
                location.pathname === "/all-restaurants" ? "border-red-500" : ""
              } transition-all duration-500`}
            />
          </li>
          <li
            className={`${
              location.pathname === "/About"
                ? "text-red-500"
                : "hover:text-red-500"
            } transition-colors duration-300`}
          >
            <Link to="/About">About</Link>
            <hr
              className={`${
                location.pathname === "/About" ? "border-red-500" : ""
              } transition-all duration-500`}
            />
          </li>
        </ul>
      </div>
      <div className="navbar-end xl:mr-72">
        {isAuthenticated && role == "user" ? (
          <>
            <Link to="/account">
              <div
                className="tooltip tooltip-info hidden lg:flex flex-col gap-1"
                data-tip="account"
              >
                <FaUserAlt size={22} className="cursor-pointer " />
              </div>
            </Link>

            <div className="hidden lg:flex">
              <SignOutButton />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold font-sans text-red-600 cursor-pointer">
              <Link to="login">Login</Link>
            </h1>
          </>
        )}
      </div>
    </div>
  );
};

export default NavBar;
