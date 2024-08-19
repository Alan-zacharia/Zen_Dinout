import * as React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { RestaurantCardPropType } from "../../../types/user/restaurantCardProps";

const RestaurantCard: React.FC<RestaurantCardPropType> = ({ restaurant }) => {
  return (
    <Card sx={{ maxWidth: 345, height: 280 }}>
      <CardMedia
        component="img"
        style={{ height: "180px" }}
        image={restaurant.featuredImage?.url}
        alt="restaurantImage"
      />
      <CardContent>
        <Typography
          variant="h3"
          color="text.black"
          fontSize="1rem"
          fontWeight="800"
          fontFamily={"sans"}
          sx={{ mb: 1 }}
        >
          {restaurant.restaurantName}
        </Typography>
        <Typography
          sx={{ mb: 0.5 }}
          variant="h5"
          color="text.secondary"
          fontSize=".8rem"
          fontWeight="600"
        >
          {restaurant.place_name && restaurant.place_name.length > 35
            ? restaurant.place_name?.substring(0, 35) + "..."
            : restaurant.place_name}
        </Typography>
        <Typography
          variant="h5"
          color="text.secondary"
          fontSize=".8rem"
          fontWeight="600"
        >
          ₹{restaurant.tableRate * 2} for 2 (approx) | Fast Foodsds
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;
