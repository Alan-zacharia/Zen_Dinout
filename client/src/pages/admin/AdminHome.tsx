import React, { useState } from "react";
import Header from "../../components/admin/shared/Header";
import Sidebar from "../../components/admin/shared/SideBar";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const [menu, setMenu] = useState(false);

  function handleChange() {
    setMenu((menu) => !menu);
  }

  function closeSideBar() {
    setMenu(false);
  }

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      <Sidebar menu={menu} onClose={closeSideBar} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header handleChange={handleChange} menu={menu} />
        <div className="p-4 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
