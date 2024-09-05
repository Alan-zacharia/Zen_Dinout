import React, { useState, useEffect } from "react";
import RestaurantCard from "../../components/user/layouts/RestaurantCard";
import {
  Container,
  Grid,
  Box,
  Paper,
  Autocomplete,
  Stack,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";
import { filterRestaurants } from "../../redux/restaurant/restaurantSearchSlice";
import { Link } from "react-router-dom";
import RestuarantNotFound from "../../components/layouts/RestuarantNotFound";

const RestaurantsListingPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedLocation = useSelector(
    (state: RootState) => state.restaurant.selectedLocation
  );
  const restaurants = useSelector(
    (state: RootState) => state.restaurant.restaurants
  );
  const filteredRestaurants = useSelector(
    (state: RootState) => state.restaurant.filteredRestaurants
  );
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    dispatch(filterRestaurants());
  }, [restaurants, dispatch, selectedLocation]);
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const displayedRestaurants = filteredRestaurants?.filter((restaurant) =>
    restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Container className="flex flex-col min-h-screen">
        <Box display="flex" gap={2} py={4}>
          <Box sx={{ width: "25%" }} className="hidden lg:flex">
            <Paper sx={{ height: "100px", padding: 2, width: "100%" }}>
              <Stack spacing={2} sx={{ width: 250 }}>
                <Autocomplete
                  id="restaurantSearch"
                  freeSolo
                  options={filteredRestaurants?.map(
                    (option) => option.restaurantName
                  )}
                  onInputChange={(_, newValue) => setSearchTerm(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search restaurants .........."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  )}
                />
              </Stack>
            </Paper>
          </Box>
          {displayedRestaurants && displayedRestaurants.length > 0 ? (
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
              {displayedRestaurants &&
                displayedRestaurants.map((restaurant, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Link to={`/restaurant-view/${restaurant._id}`}>
                      <RestaurantCard restaurant={restaurant} />
                    </Link>
                  </Grid>
                ))}
            </Grid>
          ) : (
            <Container className="min-h-screen">
              <Box display="flex" gap={2} py={4}>
                <RestuarantNotFound />
              </Box>
            </Container>
          )}
        </Box>
        {displayedRestaurants && displayedRestaurants.length > 8 && (
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
            <p className="text-black cursor-pointer text-lg">next &raquo;</p>
          </Box>
        )}
      </Container>
    </>
  );
};

export default RestaurantsListingPage;
