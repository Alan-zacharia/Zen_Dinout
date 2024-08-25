import React, { useEffect } from "react";
import RestaurantCard from "../../components/user/layouts/RestaurantCard";
import {
  Container,
  Grid,
  Box,
  Paper,
  Autocomplete,
  Typography,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import RestaurantSearchInput from "../../components/user/shared/RestaurantSearchInput";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { filterRestaurants } from "../../redux/restaurant/restaurantSearchSlice";
import { Link } from "react-router-dom";
import SortButton from "../../components/user/shared/SortButton";
import RestuarantNotFound from "../../components/layouts/RestuarantNotFound";
const RestaurantsListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const options = [
    {
      title: "North indian",
      firstLetter: "A",
    },
    {
      title: "North indian",

      firstLetter: "North indian",
    },
  ];
 
  const selectedLocation = useSelector(
    (state: RootState) => state.restaurant.selectedLocation
  );
  const restaurants = useSelector(
    (state: RootState) => state.restaurant.restaurants
  );
  const filteredRestaurants = useSelector(
    (state: RootState) => state.restaurant.filteredRestaurants
  );

  useEffect(() => {
    dispatch(filterRestaurants());
  }, [restaurants, dispatch, selectedLocation]);
  
  return (
    <>
      {filteredRestaurants && filteredRestaurants.length > 0 ? (
        <Container className="flex flex-col min-h-screen">
          <Box display="flex" gap={2} py={4}>
            <Box sx={{ width: "25%" }} className="hidden lg:flex">
              <Paper sx={{ height: "400px", padding: 2, width: "100%" }}>
                <RestaurantSearchInput />

                <Typography
                  variant="h6"
                  gutterBottom
                  component="h6"
                  sx={{ p: 1, pb: 0 }}
                  fontSize="1rem"
                  fontWeight="800"
                  className="text-gray-500"
                >
                  Cuisines
                </Typography>

                <Autocomplete
                  id="Cuisines"
                  options={options.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.firstLetter}
                  getOptionLabel={(option) => option.title}
                  sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Search for cuisines....." />
                  )}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  component="h6"
                  sx={{ p: 1, pb: 0 }}
                  fontSize="1rem"
                  fontWeight="800"
                  className="text-gray-500"
                >
                  Cuisines
                </Typography>
                <Autocomplete
                  id="ssd"
                  options={options.sort(
                    (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
                  )}
                  groupBy={(option) => option.firstLetter}
                  getOptionLabel={(option) => option.title}
                  sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="With categories" />
                  )}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  component="h6"
                  sx={{ p: 1, pb: 0 }}
                  fontSize="1rem"
                  fontWeight="800"
                  className="text-gray-500"
                >
                  Sort by
                </Typography>
                <SortButton />
              </Paper>
            </Box>

            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              {filteredRestaurants && filteredRestaurants.map((restuarant, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Link to={`/restaurant-view/${restuarant._id}`}>
                    {" "}
                    <RestaurantCard restaurant={restuarant} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>
          {filteredRestaurants && filteredRestaurants.length > 8 && (
            <Box
              display="flex"
              gap={1}
              py={4}
              justifyContent={"end"}
              alignItems={"center"}
            >
              <p className="text-black cursor-pointer text-lg">
                &laquo; previous
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1  ">
                1
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                2
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                3
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                4
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                5
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                6
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                7
              </p>
              <p className="text-black font-semibold border  bg-white px-3 p-1 ">
                8
              </p>
              <p className="text-black cursor-pointer text-lg">next &raquo;</p>
            </Box>
          )}
        </Container>
      ) : (
        <Container className=" min-h-screen">
          <Box display="flex" gap={2} py={4}>
            <RestuarantNotFound />
          </Box>
        </Container>
      )}
    </>
  );
};

export default RestaurantsListingPage;
