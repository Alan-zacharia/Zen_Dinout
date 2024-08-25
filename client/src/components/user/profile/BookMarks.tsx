import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import { savedRestaurantsType } from "../../../types/userTypes";
import { FaLocationDot } from "react-icons/fa6";
import { IoMdTimer } from "react-icons/io";
import { format } from "date-fns";
import { Link } from "react-router-dom";

const BookMarks: React.FC = () => {
  const [bookmarks, setBookMarks] = useState<savedRestaurantsType[]>([]);
  useEffect(() => {
    const fetchBookMarkedRestaurant = async () => {
      try {
        const res = await axiosInstance.get("/api/bookmarks");
        setBookMarks(res.data.savedRestaurants);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBookMarkedRestaurant();
  }, []);

  return (    
    <div className="lg:p-8 flex flex-col gap-4 w-[400px] lg:w-[500px]">
      {bookmarks.length === 0 ? (
        <p className="text-gray-500 font-bold">No saved Restaurants.</p>
      ) : (
        bookmarks.map((restaurant) => (
          <div
            className="bg-white shadow-lg rounded-lg p-7 flex flex-col gap-2"
            key={restaurant._id}
          >
            <Link to={`/restaurant-view/${restaurant.restaurantId._id}`}>
              <div className="flex items-center gap-6 cursor-pointer">
                <img
                  src={restaurant?.restaurantId?.featuredImage.url}
                  alt={restaurant?.restaurantId?.restaurantName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col">
                  <h2 className="text-xl font-semibold">
                    {restaurant.restaurantId.restaurantName}
                  </h2>
                  <p className="text-gray-600 flex items-center gap-1">
                    <FaLocationDot size={16} />
                    {restaurant?.restaurantId?.address}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <IoMdTimer size={16} />
                    {`${format(
                      new Date(restaurant.restaurantId.openingTime),
                      "p"
                    )} - ${format(
                      new Date(restaurant.restaurantId.closingTime),
                      "p"
                    )}`}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default BookMarks;
