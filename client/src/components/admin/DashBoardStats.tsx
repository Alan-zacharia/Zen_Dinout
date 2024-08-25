import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { BiRestaurant } from "react-icons/bi";

interface totalCounts {
  totalUsers: number;
  totalRestaurants: number;
};

type DashBoardStatProps = {
  count : totalCounts
}
const DashBoardStat: React.FC<DashBoardStatProps> = ({count}) => {
  return (
    <div className="md:flex md:flex-col lg:flex-row grid grid-cols-2  gap-4 w-auto">
      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-400">
          <FaUserCircle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-bold">Revenue</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-bold">$9999</strong>
            <span className="text-sm text-red-400 pl-2 font-bold">- $200</span>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-red-500">
          <BiRestaurant className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-bold">
            Total Restaurants
          </span>
          <div className="flex items-center">
            <strong className="text-xl text-gray-700 font-semibold">{count.totalRestaurants}</strong>
          </div>
        </div>
      </BoxWrapper>

      <BoxWrapper>
        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-300">
          <FaUserCircle className="text-2xl text-white" />
        </div>
        <div className="pl-4">
          <span className="text-sm text-gray-500 font-bold">Total Users</span>
          <div className="flex items-center">
            <strong className="text-lg text-gray-700 font-bold">{count.totalUsers}</strong>
          </div>
        </div>
      </BoxWrapper>

    
    </div>
  );
};
export default DashBoardStat;

const BoxWrapper: React.FC<any> = ({ children }) => {
  return (
    <div className="bg-white rounded-2xl p-4 flex-1 border border-gray-200 flex items-center mb-4 md:mb-0 md:w-full lg:w-1/4">
      {children}
    </div>
  );
};
