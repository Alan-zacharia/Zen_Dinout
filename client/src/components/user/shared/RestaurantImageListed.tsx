import React from "react";

interface restaurantImagesComponentProps {
  restaurantImages: string[] | undefined;
}
const RestaurantImagesListed: React.FC<restaurantImagesComponentProps> = ({
  restaurantImages,
}) => {
  return (
    <div className="max-h-auto mx-16 ">
      <div className="flex gap-4 flex-col ">
        <div className="flex gap-4 flex-wrap w-2/3 ">
          {restaurantImages &&
            restaurantImages.map((image, index) => {
              return (
                <>
                  <img
                    key={index}
                    src={image}
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
