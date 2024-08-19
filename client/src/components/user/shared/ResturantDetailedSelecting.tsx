import React, { useState } from "react";

type TabName = "Overview" | "Menu" | "Photos" | "Reviews" | "About";
interface selectingProps {
  onSelectTab: (tabName: TabName) => void;
}
const ResturantDetailedSelecting : React.FC<selectingProps> = ({ onSelectTab }) => {
  const [selectedTab, setSelectedTab] = useState<string>("Overview");
  const handleSelectTab = (tabName: TabName) => {
    onSelectTab(tabName);
    setSelectedTab(tabName)
  };

  return (
    <div className="max-h-auto xl:mx-16 mx-4 xl:w-[1200px] pt-10 ">
      <ul className="flex gap-6 lg:gap-20 font-bold text-sm lg:text-xl pb-5 flex-wrap">
        <li
          className={`cursor-pointer ${selectedTab == 'Overview' ? 'border-b-2 border-b-red-400 text-red-400' : ''}`}
          onClick={() => handleSelectTab("Overview")}
        >
          Overview
        </li>
        <li
          className={`cursor-pointer ${selectedTab == "Menu" ? "border-b-2 border-b-red-400 cursor-pointer text-red-400" : ""}`}
          onClick={() => handleSelectTab("Menu")}
        >
          Menu
        </li>
        <li
          className={`cursor-pointer ${selectedTab == "Photos" ? "border-b-2 border-b-red-400 cursor-pointer text-red-400" : ""}`}
          onClick={() => handleSelectTab("Photos")}
        >
          Photos
        </li>
        <li
          className={`cursor-pointer ${selectedTab == "Reviews" ? "border-b-2 border-b-red-400 cursor-pointer text-red-400" : ""}`}
          onClick={() => handleSelectTab("Reviews")}
        >
          Reviews
        </li>
       
      </ul>
      <div className="w-full xl:w-[1200px] h-0.5  bg-gray-300" />
    </div>
  );
};

export default ResturantDetailedSelecting;
