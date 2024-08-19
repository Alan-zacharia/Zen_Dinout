import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Autocomplete from "@mui/material/Autocomplete";

const RestaurantSearchInput: React.FC = () => {
  return (
    <Stack spacing={2} sx={{ width: 250 }}>
      <Autocomplete
        id="restaurantSearch"
        freeSolo
        options={top100Films.map((option) => option.title)}
        renderInput={(params) => (
          <TextField {...params} label="Search restaurants .........." />
        )}
      />
    </Stack>
  );
};

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
];

export default RestaurantSearchInput;
