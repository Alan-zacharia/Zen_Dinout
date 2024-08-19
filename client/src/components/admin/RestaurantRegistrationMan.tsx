import axios from "../../api/axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
axios.defaults.withCredentials = true;

interface RestaurantType {
  _id: string;
  email: string;
  restaurantName: string;
  contact: string;
}
const RestaurantMangement: React.FC = () => {
  const [restaurant, setRestaurant] = useState<RestaurantType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      await axios
        .get("/admin/restaurants-approval-lists")
        .then((response) => {
          setRestaurant(response.data.restaurants);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchData();
  }, []);

  return (
    <div className="text-gray-900">
      <div className="p-4 flex lg:pb-20">
        <h1 className="text-3xl font-bold hidden lg:flex ">Restaurant Approves</h1>
        <h1 className="text-2xl flex lg:hidden lg:text-3xl font-bold ">Restaurants</h1>
      </div>
      <div className="relative  shadow-md  border overflow-auto border-gray-300 mb-6 ">
        <table className="w-full text-sm text-left rtl:text-right text-black  ">
          <thead className="text-base  uppercase  bg-gray-800 text-white h-16">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email Address
              </th>
              <th scope="col" className="px-6 py-3">
                Phone
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {restaurant && restaurant.length > 0 ? (
              restaurant.map((restaurant: RestaurantType, index: number) => {
                return (
                  <tr
                    className="text-black border-t border-t-neutral-400 font-medium"
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap "
                    >
                      {restaurant.restaurantName}
                    </th>
                    <td className="px-6 py-4">{restaurant.email}</td>
                    {restaurant.contact ? (
                      <td className="px-6 py-4">+91 {restaurant.contact}</td>
                    ) : (
                      <td className="px-6 py-4">Nill</td>
                    )}
                    <td className="p-3 px-5 flex justify-end">
                      <Link
                        to={`/admin/restaurant-approval/:${restaurant._id}`}
                      >
                        <button className="p-2 bg-green-500 text-white rounded-xl px-4 hover:bg-green-400">
                          Veiw
                        </button>
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="border-b  bg-gray-100">
                <td
                  colSpan={5}
                  className="p-3 text-center text-black font-bold text-2xl"
                >
                  Restaurant not found....
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RestaurantMangement;
