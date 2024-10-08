import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RestaurantViewComponent from "../../components/user/RestaurantViewComponent";
import RestaurantReview from "../../components/user/shared/RestaurantReview";
import RestauarantAbout from "../../components/user/shared/RestauarantAbout";
import RestaurantImagesListed from "../../components/user/shared/RestaurantImageListed";
import ResturantDetailedSelecting from "../../components/user/shared/ResturantDetailedSelecting";
import RestaurantMenu from "../../components/user/layouts/Menu";
import axios from "axios";
import { RestaurantDetailType } from "../../types/restaurantTypes";
import Loading from "../../components/layouts/Loading";

const RestaurantViewDetails: React.FC = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>("Overview");
  const [restaurantDetails, setRestaurantDetails] = useState<
    RestaurantDetailType | undefined
  >(undefined);
  const [restuarantImages, setRestaurantImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/restaurant-view/${restaurantId}`
        );
        setRestaurantDetails(response.data.restaurant);

        setRestaurantImages(response.data.restaurantImages);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data.message);
          if (error.response?.data.message == "Invalid restaurantId format") {
            navigate("page-not-found");
          }
        }
        console.log(error);
      }
    };
    fetchData();
  }, [restaurantId]);
  const handleTabSelect = (tabName: string) => {
    setSelectedTab(tabName);
  };
  return (
    <>
      {restaurantDetails ? (
        <>
          <div className="flex  ">
            <RestaurantViewComponent restaurantDetails={restaurantDetails} />
          </div>
          <div className="flex flex-col mx-6 gap-10 pb-20">
            <ResturantDetailedSelecting onSelectTab={handleTabSelect} />
            {selectedTab === "Overview" && (
              <>
                <RestauarantAbout restaurantDetails={restaurantDetails} />
                <RestaurantMenu />
                <RestaurantReview restaurantId={restaurantId} />
              </>
            )}
            {selectedTab === "Photos" && (
              <RestaurantImagesListed restaurantImages={restuarantImages} />
            )}
            {selectedTab === "Menu" && (
              <>
                <RestaurantMenu />

                <RestauarantAbout restaurantDetails={restaurantDetails} />
              </>
            )}
            {selectedTab === "Reviews" && (
              <RestaurantReview restaurantId={restaurantId} />
            )}
          </div>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default RestaurantViewDetails;
