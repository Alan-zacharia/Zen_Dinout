// import { useEffect } from "react";
// import { useSelector } from "react-redux";
// import {
//   fetchRestaurants,
//   updateSearchQuery,
//   updateRateRange,
//   updateVegOrNonVegType,
//   filterRestaurants,
// } from "../../../redux/restaurant/restaurantSearchSlice";
// import Home from "../Home";
// import Card from "../../layouts/Card";
// import Hero from "./Hero";
// import { RootState, useAppDispatch } from "../../../redux/store";
// import SectionHomeDetails from "./SectionHomeDetails";
// import { Box } from "@mui/material";

// const HomeLayout = () => {
//   const dispatch = useAppDispatch();
//   const searchQuery = useSelector(
//     (state: RootState) => state.restaurant.searchQuery
//   );
//   const selectedLocation = useSelector(
//     (state: RootState) => state.restaurant.selectedLocation
//   );
//   const minRate = useSelector((state: RootState) => state.restaurant.minRate);
//   const maxRate = useSelector((state: RootState) => state.restaurant.maxRate);
//   const vegOrNonVegType = useSelector(
//     (state: RootState) => state.restaurant.vegOrNonVegType
//   );
//   const filteredRestaurants = useSelector(
//     (state: RootState) => state.restaurant.filteredRestaurants
//   );

//   useEffect(() => {
//     dispatch(fetchRestaurants());
//   }, [dispatch]);

//   useEffect(() => {
//     dispatch(filterRestaurants());
//   }, [searchQuery, selectedLocation, minRate, maxRate, vegOrNonVegType, dispatch]);

//   const handleSearch = (
//     query: string,
//     minPrice?: number,
//     maxPrice?: number,
//     vegOnly?: boolean
//   ) => {
//     dispatch(updateSearchQuery(query));
//     dispatch(updateRateRange({ minRate: minPrice, maxRate: maxPrice }));
//     dispatch(updateVegOrNonVegType(vegOnly ? "veg" : vegOnly === false ? "non-veg" : "both"));
//   };

//   const handleRateRangeChange = (
//     minRate: number | undefined,
//     maxRate: number | undefined
//   ) => {
//     dispatch(updateRateRange({ minRate, maxRate }));
//   };

//   return (
//     <>
//       <Hero
//         handleSearch={handleSearch}
//         handleRateRangeChange={handleRateRangeChange}
//       />
//       <Home />
//       <section className="flex flex-wrap lg:justify-normal lg:ml-20 mb-20 justify-center sm:px-20 xl:px-60 gap-5 lg:gap-5">
//         <Card restaurants={filteredRestaurants} />
//       </section>
//       <section>
//         <div>
//           <Box
//             display="flex"
//             gap={1}
//             py={4}
//             pr={20}
//             justifyContent={"end"}
//             alignItems={"center"}
//             className="cursor-pointer"
//           >
//             <p className="text-black cursor-pointer text-lg">
//               &laquo; previous
//             </p>
//             <p className="text-black font-semibold border  bg-white px-3 p-1  ">
//               1
//             </p>
//             <p className="text-black font-semibold border  bg-white px-3 p-1 ">
//               2
//             </p>

//             <p className="text-black cursor-pointer text-lg">next &raquo;</p>
//           </Box>
//         </div>
//       </section>
//       <div className="hidden lg:flex lg:flex-col lg:h-[300px]">
//         <SectionHomeDetails />
//       </div>
//     </>
//   );
// };

// export default HomeLayout;

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  fetchRestaurants,
  updateSearchQuery,
  updateRateRange,
  updateVegOrNonVegType,
  filterRestaurants,
} from "../../../redux/restaurant/restaurantSearchSlice";
import Home from "../Home";
import Card from "../../layouts/Card";
import Hero from "./Hero";
import { RootState, useAppDispatch } from "../../../redux/store";
import SectionHomeDetails from "./SectionHomeDetails";
import { Box, Button, Typography } from "@mui/material";

const HomeLayout = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.restaurant.searchQuery
  );
  const selectedLocation = useSelector(
    (state: RootState) => state.restaurant.selectedLocation
  );
  const minRate = useSelector((state: RootState) => state.restaurant.minRate);
  const maxRate = useSelector((state: RootState) => state.restaurant.maxRate);
  const vegOrNonVegType = useSelector(
    (state: RootState) => state.restaurant.vegOrNonVegType
  );
  const filteredRestaurants = useSelector(
    (state: RootState) => state.restaurant.filteredRestaurants
  );

  const [currentPage, setCurrentPage] = useState(1);
  const restaurantsPerPage = 4;

  useEffect(() => {
    dispatch(fetchRestaurants());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterRestaurants());
  }, [
    searchQuery,
    selectedLocation,
    minRate,
    maxRate,
    vegOrNonVegType,
    dispatch,
  ]);

  const handleSearch = (
    query: string,
    minPrice?: number,
    maxPrice?: number,
    vegOnly?: boolean
  ) => {
    dispatch(updateSearchQuery(query));
    dispatch(updateRateRange({ minRate: minPrice, maxRate: maxPrice }));
    dispatch(
      updateVegOrNonVegType(
        vegOnly ? "veg" : vegOnly === false ? "non-veg" : "both"
      )
    );
  };

  const handleRateRangeChange = (
    minRate: number | undefined,
    maxRate: number | undefined
  ) => {
    dispatch(updateRateRange({ minRate, maxRate }));
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * restaurantsPerPage;
  const endIndex = startIndex + restaurantsPerPage;
  const paginatedRestaurants = filteredRestaurants.slice(startIndex, endIndex);

  return (
    <>
      <Hero
        handleSearch={handleSearch}
        handleRateRangeChange={handleRateRangeChange}
      />
      <Home />
      <section className="flex flex-wrap lg:justify-normal lg:ml-20 mb-20 justify-center sm:px-20 xl:px-60 gap-5 lg:gap-5">
        <Card restaurants={paginatedRestaurants} />
      </section>
      <section>
        <div>
          <ul className="flex mx-80 justify-end mb-4">
            <li>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                Prev
              </button>
            </li>
            {Array(Math.ceil(filteredRestaurants.length / restaurantsPerPage))
              .fill(0)
              .map((_, index) => (
                <li key={index}>
                  <button
                    onClick={() => handlePageChange(index + 1)}
                    className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow ${
                      index + 1 === currentPage ? "bg-gray-200" : ""
                    }`}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            <li>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={
                  currentPage ===
                  Math.ceil(filteredRestaurants.length / restaurantsPerPage)
                }
                className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
              >
                Next
              </button>
            </li>
          </ul>
        </div>
      </section>
      <div className="hidden lg:flex lg:flex-col lg:h-[300px]">
        <SectionHomeDetails />
      </div>
    </>
  );
};

export default HomeLayout;