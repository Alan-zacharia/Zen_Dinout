import React from "react";
import GoogleMap from "../../GoogleMap";
import { RestaurantDetailType } from "../../../types/restaurantTypes";
import { FaLocationArrow } from "react-icons/fa";
import { IoCall } from "react-icons/io5";
import { MdEmail } from "react-icons/md";

interface ContactInfromationsProps {
  restaurantDetails: RestaurantDetailType;
}
const ContactInfromations: React.FC<ContactInfromationsProps> = ({
  restaurantDetails,
}) => {
  const locationUrl = `https://www.google.com/maps/dir/?api=1&destination=${restaurantDetails.place_name}`;

  return (
    <section className="max-h-auto  bg-white rounded-xl shadow-lg hidden xl:flex flex-col">
      <div className="w-[400px] p-5 flex flex-col">
        <h1 className="text-2xl font-bold pb-5">Here to find location</h1>
        <div className="flex flex-col gap-6">
          <GoogleMap
            latitude={restaurantDetails.location.coordinates[1]}
            longitude={restaurantDetails.location.coordinates[0]}
          />

          <div className="flex flex-col  justify-center pt-10 gap-5">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                We are here to help
              </h3>
              <p className="text-black font-semibold cursor-pointer flex gap-2 items-center">
                <span className="rounded-full p-2 font-bold bg-blue-500">
                  <IoCall size={15} className="text-white" />
                </span>
                Call the restaurant : {restaurantDetails.contact}
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-5">
              <p className="text-blue-500 font-semibold underline cursor-pointer flex gap-2 items-center">
                <FaLocationArrow size={13} />
                <a href={locationUrl} target="_blank" rel="noopener noreferrer">
                  location : Get Direction
                </a>
              </p>
              <p className="text-blue-500 font-semibold underline cursor-pointer flex gap-2 items-center">
                <MdEmail /> Email : {restaurantDetails.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInfromations;
