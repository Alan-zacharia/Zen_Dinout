import React from "react";
import { Link } from "react-router-dom";
import { RestaurantDetailType } from "../../types/restaurantTypes";
import RestuarantNotFound from "./RestuarantNotFound";
interface CardProps {
  restaurants: RestaurantDetailType[];
}
const Card: React.FC<CardProps> = ({ restaurants }) => {
  return (
    <>
      {restaurants && restaurants.length > 0 ? (
        restaurants.map((details, index: number) => {
          return (
            <Link to={`/restaurant-view/${details._id}`} key={index}>
              <div
                key={index}
                className="flex cursor-pointer mb-5 rounded-lg bg-white w-full lg:w-[calc(25% - 18px)] max-w-[300px] shadow-lg shadow-gray-400 transform transition duration-200 hover:-translate-y-2 ease-in"
              >
                <div className="h-full border-2 border-gray-200 border-opacity-60 rounded-lg overflow-hidden">
                  <img
                    src={details.featuredImage?.url}
                    alt="image"
                    className="h-48 md:h-44 lg:h-32 w-[300px] rounded-t-sm object-cover object-center"
                  />
                  <div className=" p-2">
                    <h1 className="text-base md:text-xl lg:text-base font-bold mb-1">
                      {details.restaurantName}
                    </h1>
                    <p className="text-sm md:text-sm lg:text-sm leading-relaxed mb-1">
                      {details && details.address && details.address.length > 43
                        ? details.address.substring(0, 43) + "..."
                        : details.address}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })
      ) : (
        <RestuarantNotFound />
      )}
    </>
  );
};

export default Card;
