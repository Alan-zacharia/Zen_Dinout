import React from "react";
import { RestaurantImageType } from "../../../types/restaurantTypes";

interface restaurantImagesComponentProps {
  restaurantImages: RestaurantImageType[] | undefined;
}
const RestaurantImagesListed: React.FC<restaurantImagesComponentProps> = ({
  restaurantImages,
}) => {
  return (
    <div className="max-h-auto mx-16 ">
      <div className="flex gap-4 flex-col ">
        <div className="flex gap-4 flex-wrap w-2/3 ">
          {restaurantImages &&
            restaurantImages.map((image) => {
              return (
                <>
                  <img
                    src={image.url}
                    alt="restuarntImages"
                    className="w-[250px] rounded-xl cursor-pointer transition duration-200 hover:scale-105 "
                  />
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RestaurantImagesListed;
