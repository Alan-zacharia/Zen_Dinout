import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../api/axios";
import { RestaurantDetailType } from "../../types/restaurantTypes";
import { calculateDistance } from "../../utils/functions";

const initialState = {
  searchQuery: "",
  selectedLocation: null as {
    latitude: number;
    longitude: number;
    placeName?: string;
  } | null,
  minRate: undefined as number | undefined,
  maxRate: undefined as number | undefined,
  vegOrNonVegType: "both" as "veg" | "non-veg" | "both",
  restaurants: [] as RestaurantDetailType[],
  filteredRestaurants: [] as RestaurantDetailType[],
};

export const fetchRestaurants = createAsyncThunk(
  "restaurants/fetchRestaurants",
  async () => {
    const response = await axios.get("/api/get-restaurants");
    return response.data.restaurant;
  }
);

const restaurantsSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    updateSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    updateRateRange: (
      state,
      action: PayloadAction<{ minRate?: number; maxRate?: number }>
    ) => {
      state.minRate = action.payload.minRate;
      state.maxRate = action.payload.maxRate;
    },
    updateSelectedLocation: (
      state,
      action: PayloadAction<{
        latitude: number;
        longitude: number;
        placeName?: string;
      } | null> 
    ) => {
      state.selectedLocation = action.payload;
    },
    updateVegOrNonVegType: (
      state,
      action: PayloadAction<"veg" | "non-veg" | "both">
    ) => {
      state.vegOrNonVegType = action.payload;
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.minRate = undefined;
      state.maxRate = undefined;
      state.vegOrNonVegType = "both";
      state.filteredRestaurants = state.restaurants;
    },
    clearLocation: (state) => {
      state.selectedLocation = null;
      state.filteredRestaurants = state.restaurants;
    },
    filterRestaurants: (state) => {
      const radius = 20;
      const normalize = (str: string) => str.replace(/\s+/g, "").toLowerCase();
      state.filteredRestaurants = state.restaurants.filter((restaurant) => {
        const normalizedSearchTerm = normalize(state.searchQuery);
        const normalizedRestaurantName = normalize(restaurant.restaurantName);

        const matchesCuisine = restaurant.cuisines?.some((cuisine) =>
          normalize(cuisine).includes(normalizedSearchTerm)
        );

        const matchesSearch =
          normalizedRestaurantName.includes(normalizedSearchTerm) ||
          matchesCuisine;

        const matchesLocation = state.selectedLocation
          ? calculateDistance(
              state.selectedLocation.latitude,
              state.selectedLocation.longitude,
              restaurant.location.coordinates[1],
              restaurant.location.coordinates[0]
            ) <= radius
          : true;

        const matchesRate =
          (state.minRate === undefined ||
            restaurant.tableRate >= state.minRate) &&
          (state.maxRate === undefined ||
            restaurant.tableRate <= state.maxRate);

        const matchesVegOrNonVeg =
          state.vegOrNonVegType === "both" ||
          restaurant.vegOrNonVegType === state.vegOrNonVegType;
        return (
          matchesSearch && matchesLocation && matchesRate && matchesVegOrNonVeg
        );
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchRestaurants.fulfilled,
      (state, action: PayloadAction<RestaurantDetailType[]>) => {
        state.restaurants = action.payload;
        state.filteredRestaurants = action.payload;
      }
    );
  },
});

export const {
  updateSearchQuery,
  updateRateRange,
  updateSelectedLocation,
  updateVegOrNonVegType,
  clearFilters,
  clearLocation,
  filterRestaurants,
} = restaurantsSlice.actions;
export default restaurantsSlice.reducer;
