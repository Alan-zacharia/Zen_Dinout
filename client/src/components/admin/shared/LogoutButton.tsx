import React from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../../services/adminApiClient";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../redux/user/userSlice";
import logout from "../../../utils/Logout";
import { HiOutlineLogout } from "react-icons/hi";

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function hanldeLogin() {
    dispatch(clearUser());
    logout("Logout out successfully");
    adminLogout()
    navigate("/admin/login");
  }
  return (
    <div className="cursor-pointer rounded-sm hover:text-white mb-6 hover:bg-red-500 font-medium transition duration-700 flex items-center gap-2 px-3 py-3 rounded-xs text-base hover:no-underline "
    onClick={hanldeLogin}   
    >
      <span className="text-xl   ">
        <HiOutlineLogout />
      </span>
      <button
        className="text-white font-semibold  hover:font-bold"
      >
        Log Out
      </button>
    </div>
  );
};

export default LogoutButton;
