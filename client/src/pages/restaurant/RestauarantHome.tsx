import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/seller/shared/SideBar";
import Header from "../../components/seller/shared/Header";
import { BsChatRightFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

const SellerHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <main className="flex-1 overflow-auto ml-5 relative">
          <Outlet />
          <div
            className="tooltip fixed bottom-5 right-5 lg:right-14 cursor-pointer rounded-full p-3.5 bg-green-400 hidden lg:flex"
            onClick={() => navigate("/restaurant/chat")}
            data-tip="Enquiries"
          >
            <BsChatRightFill size={25} className="text-white" />
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerHome;
