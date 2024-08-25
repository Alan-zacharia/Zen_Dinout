import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import BannerImage from "../../../assets/banner-image.jpg";
import { FiFilter } from "react-icons/fi";
import { useAppDispatch } from "../../../redux/store";
import { clearFilters } from "../../../redux/restaurant/restaurantSearchSlice";

interface HeroProps {
  handleSearch: (
    query: string,
    minPrice?: number,
    maxPrice?: number,
    vegOnly?: boolean
  ) => void;
  handleRateRangeChange: (
    minRate: number | undefined,
    maxRate: number | undefined
  ) => void;
}

const Hero: React.FC<HeroProps> = ({ handleSearch, handleRateRangeChange }) => {
  const dispatch = useAppDispatch();
  const [searchItem, setSearchItem] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [minRate, setMinRate] = useState<number | undefined>(undefined);
  const [maxRate, setMaxRate] = useState<number | undefined>(undefined);
  const [vegOnly, setVegOnly] = useState<boolean | undefined>(undefined);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchItem(e.target.value);
    handleSearch(e.target.value, minRate, maxRate, vegOnly);
  };

  const handleRateChange = (
    minRate: number | undefined,
    maxRate: number | undefined
  ) => {
    setMinRate(minRate);
    setMaxRate(maxRate);
    handleRateRangeChange(minRate, maxRate);
    handleSearch(searchItem, minRate, maxRate, vegOnly);
    setIsFilterVisible(false);
  };

  const handleVegChange = (vegOnly: boolean | undefined) => {
    setVegOnly(vegOnly);
    handleSearch(searchItem, minRate, maxRate, vegOnly);
  };

  const handleClearFilters = () => {
    setSearchItem("");
    dispatch(clearFilters());
    setMinRate(undefined);
    setMaxRate(undefined);
    setVegOnly(undefined);
    handleSearch("", undefined, undefined, undefined);
    setIsFilterVisible(false);
  };

  const toggleFilterVisibility = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  const showClearButton =
    searchItem ||
    minRate !== undefined ||
    maxRate !== undefined ||
    vegOnly !== undefined;

  return (
    <div className="mx-auto">
      <div className="max-h-[500px] relative">
        <img
          src={BannerImage}
          alt="img"
          className="w-full max-h-[500px] object-bottom object-cover"
        />
        <div className="absolute top-0 left-0 w-full h-full text-gray-200 max-h-[500px] flex flex-col justify-center p-4 sm:p-10 lg:p-20 xl:p-40">
          <div className="text-base px-3 sm:text-2xl md:text-2xl pt-10 lg:text-3xl xl:text-4xl font-bold xl:px-40 flex ">
            <span className="typewriter">
              Book Table at Your
              <span className=" text-blue-500"> Favourite Restaurants</span>
            </span>
          </div>
          <div className="p-5 pt-6"></div>
          <div className="relative bg-white flex items-center px-2 xl:mx-40 mx-5 w-[300px] sm:w-[400px] lg:w-[400px] xl:w-[900px] rounded-2xl">
            <AiOutlineSearch className="text-black" size={30} />
            <input
              type="text"
              placeholder="Search for Restaurants and cuisines ....."
              value={searchItem}
              className="bg-transparent text-base p-2 lg:p-4 font-semibold text-black focus:outline-none w-full placeholder:text-xs lg:placeholder:text-base  placeholder-neutral-700"
              onChange={handleChange}
            />
            <div className="flex items-center ml-4 relative">
              <FiFilter
                size={30}
                className="text-black cursor-pointer"
                onClick={toggleFilterVisibility}
              />
              {showClearButton && (
                <div className="flex justify-center">
                  <button
                    className="py-1 px-5 bg-red-500 text-white rounded ml-2"
                    onClick={handleClearFilters}
                  >
                    Clear
                  </button>
                </div>
              )}
              {isFilterVisible && (
                <div className="bg-white shadow-lg shadow-black w-[110px] pt-4 flex flex-col text-center justify-center absolute right-0 top-full mt-2 pb-5">
                  <ul className="flex flex-col text-base text-black cursor-pointer">
                    <li className="border-b pt-1 pb-1">Filter by rate</li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        minRate === undefined && maxRate === 300
                          ? "bg-gray-100"
                          : ""
                      }`}
                      onClick={() => handleRateChange(undefined, 300)}
                    >
                      less than 300
                    </li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        minRate === 301 && maxRate === 600 ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleRateChange(301, 600)}
                    >
                      301 - 600
                    </li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        minRate === 601 ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleRateChange(601, undefined)}
                    >
                      Above 600
                    </li>
                    <li className="border-b pt-1 pb-1 mt-1">Filter by type</li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        vegOnly === true ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleVegChange(true)}
                    >
                      Veg
                    </li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        vegOnly === false ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleVegChange(false)}
                    >
                      Non-Veg
                    </li>
                    <li
                      className={`hover:bg-gray-100 p-1 ${
                        vegOnly === undefined ? "bg-gray-100" : ""
                      }`}
                      onClick={() => handleVegChange(undefined)}
                    >
                      Both
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
