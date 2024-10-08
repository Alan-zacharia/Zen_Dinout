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
  >({
    "_id": "66b9f014f56c37a90f43a6d3",
    "restaurantName": "Green land",
    "email": "greenlandrestaurant@gmail.com",
    "contact": "9876543210",
    "password": "$2a$10$kxwB4Dz8No5Ztl68wE6nzusD8kTZR/mNwDvmT29yl80P0Jhk26Xiy",
    "tableRate": 299,
    "location": {
      "type": "Point",
      "coordinates": [
        76.318072,
        9.4933925
      ]
    },
    "isListed": true,
    "cuisines": [
      "Italian",
      "Arabian"
    ],
    "isApproved": true,
    "isRejected": false,
    "secondaryImages": [
      {
        "url": "https://res.cloudinary.com/dneezqmgu/image/upload/v1724387979/restaurants/z3kkmo4bll2grqkflhd1.jpg",
        "public_id": "restaurants/z3kkmo4bll2grqkflhd1",
        "_id": "66c8128c20fbcbfef7ef8500"
      },
 
  ],
    "address": "Edapalli Town pillar opposite, Ernakulam",
    "closingTime": "2024-09-05T16:30:00.000Z",
    "description": "Whether you're looking for a quick lunch, a romantic dinner, or a place to unwind with a drink,Green Land promises an unforgettable dining experience that will leave you coming back for more.",
    "openingTime": "2024-09-05T05:30:00.000Z",
    "place_name": "Alappuzha Beach, Beach Road, Alappuzha, Kerala 688012, India",
    "vegOrNonVegType": "veg",
    "featuredImage": {
      "public_id": "restaurants/lbr3bdkfl8n7pp7ij7wl",
      "url": "https://res.cloudinary.com/dneezqmgu/image/upload/v1725545807/restaurants/lbr3bdkfl8n7pp7ij7wl.jpg"
    }
  });
  const [restuarantImages, setRestaurantImages] = useState<string[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/api/restaurant-view/${restaurantId}`
        );
        // setRestaurantDetails(response.data.restaurant);
      
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
