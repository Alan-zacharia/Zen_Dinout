

import React from "react";
import RestaurantProfileAddForm from "../../components/seller/forms/RestaurantProfileAddForm";

const RestaurantProfile: React.FC = () => {
  return (
    <section className="h-full">
      <main className="flex justify-center lg:justify-normal lg:px-[325px] pb-10">
        <div className="w-full md:w-[800px] bg-white shadow-lg shadow-red-200 rounded-lg pb-10">
          <h1 className="p-5 text-2xl font-bold text-center">
            Restaurant Details
          </h1>
          <RestaurantProfileAddForm/>
        </div>
      </main>
    </section>
  );
};

export default RestaurantProfile;
