import React from "react";
import { localStorageRemoveItem } from "../../utils/localStorageImpl";
import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";

const Home: React.FC = () => {
  localStorageRemoveItem("&reset%pas%%");
  const selectedLocation = useSelector(
    (state: RootState) => state.restaurant.selectedLocation
  );
  return (
    <>
      <div className="h-[150px] overflow-y-hidden">
        <div className="items-center flex px-10 xl:px-80 pb-10 pt-10">
          <h1 className="text-xl lg:text-3xl font-sans font-bold">
            {selectedLocation ? "Restaurants Near you" : "Explore Restaurants"}
          </h1>
        </div>
      </div>
    </>
  );
};

export default Home;
