import React from "react";
import { RestaurantDetailType } from "../../../types/restaurantTypes";
interface RestauarantAboutProps {
  restaurantDetails: RestaurantDetailType | undefined;
}

const RestauarantAbout: React.FC<RestauarantAboutProps> = ({
  restaurantDetails,
}) => {
  const formatCuisines = (cuisines: string[]) => {
    if (!cuisines || cuisines.length === 0) return "";
    const allButLast = cuisines.slice(0, -1).join(", ");
    const last = cuisines[cuisines.length - 1];
    return `${allButLast} , ${last}`;
  };
  return (
    <div className="max-h-auto xl:mx-16 w-full xl:w-[1200px] rounded-lg bg-white shadow-lg">
      {restaurantDetails && (
        <>
          <h5 className="p-5 text-lg font-bold text-black">About</h5>
          <div className="px-5 pb-4">
            <p className="text-sm font-bold text-gray-700">Cuisine</p>
            {restaurantDetails.cuisines && (
              <span className="text-xs font-semibold text-gray600">
                {formatCuisines(restaurantDetails.cuisines)}
              </span>
            )}

            <p className="text-sm font-bold text-gray-700">Type</p>
            <span className="text-xs font-semibold text-gray-600">
              Fine DIning , Dinout pay
            </span>
            <p className="text-sm font-bold text-gray-700">Average Cost</p>
            <span className="text-xs font-semibold text-gray-600">
              <span className="font-extrabold">
                {restaurantDetails?.tableRate * 2}
              </span>{" "}
              for two people
            </span>
            <p className="text-sm font-bold text-gray-700">
              Facilities and Features
            </p>
            <span className="text-xs font-semibold text-gray-600">
              399 for two people
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default RestauarantAbout;
