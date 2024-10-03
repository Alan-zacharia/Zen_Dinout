import React, { useState, useEffect } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { getLocations, fetchLocationName } from "../../../services/getPlaceApi";
import { RootState, useAppDispatch } from "../../../redux/store";
import { updateSelectedLocation } from "../../../redux/restaurant/restaurantSearchSlice";
import { useSelector } from "react-redux";

const NavLeftSide = () => {
  const [suggestion, setSuggestions] = useState([]);
  const [searchItem, setSearchItem] = useState<string>("");
  const [clearButtonShow, setClearButtonShow] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const selectedLocation = useSelector(
    (state: RootState) => state.restaurant.selectedLocation
  );

  useEffect(() => {
    if (selectedLocation) {
      setSearchItem(selectedLocation.placeName || "");
      setClearButtonShow(true);
    } else {
      setSearchItem("");
      setClearButtonShow(false);
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            const { latitude, longitude } = position.coords;
            fetchLocationName(latitude, longitude).then((res) => {
              const placeName = res.features[0].properties.name;
              dispatch(
                updateSelectedLocation({
                  latitude,
                  longitude,
                  placeName,
                })
               );
            });
          }
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, [dispatch]);

  const handleLocationSearch = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const searchedTerm = e.target.value;
      setSearchItem(searchedTerm);
      const data = await getLocations(searchedTerm);
      setSuggestions(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInput = (suggestion: any) => {
    setClearButtonShow(true);
    setSearchItem(suggestion.place_name);
    setSuggestions([]);
    dispatch(
      updateSelectedLocation({
        latitude: suggestion.geometry.coordinates[1],
        longitude: suggestion.geometry.coordinates[0],
        placeName: suggestion.place_name,
      })
    );
  };

  const handleClear = () => {
    setSearchItem("");
    setSuggestions([]);
    setClearButtonShow(false);
    dispatch(updateSelectedLocation(null));
  };

  return (
    <>
      <div className="lg:flex items-center text-[14px] px-5  flex flex-col relative ">
        <input
          type="text"
          className="px-2 w-[150px] outline-none border border-black"
          onChange={handleLocationSearch}
          value={searchItem}
          placeholder="Location......."
        />
        <FaLocationDot size={23} className="absolute right-12 top-2" />
        {suggestion && suggestion.length > 0 && (
          <ul className="bg-white absolute w-[200px] top-12 overflow-x-auto h-52">
            {suggestion.map((suggestion: any, index: number) => (
              <li
                key={index}
                className="px-4 py-3 cursor-pointer hover:bg-blue-200"
                onClick={() => handleInput(suggestion)}
              >
                {suggestion.place_name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {clearButtonShow && (
        <button
          className="px-4 text-white py-2 bg-red-500 text-sm rounded-lg "
          onClick={handleClear}
        >
          clear
        </button>
      )}
    </>
  );
};

export default NavLeftSide;
