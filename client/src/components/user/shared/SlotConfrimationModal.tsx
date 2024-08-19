import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector , useDispatch } from "react-redux";
import { RootState } from "../../../redux/store";
import { confirmBooking } from "../../../redux/user/tableBookingSlice";
import { RestaurantType } from "../../../types/restaurantTypes";

const SlotConfrimationModal = ({
  setShowModal,
  isModalOpen,
  restaurantDetails,
  time,
  selectedGuests,
  date,
  tableId,
  timeSlotId
}: {
  setShowModal: (slotStartTime: string , tableId : string , slotId : string) => void;
  isModalOpen: boolean;
  restaurantDetails: RestaurantType | undefined;
  time: string;
  selectedGuests: number;
  date: string;
  tableId : string | undefined;
  timeSlotId : string | undefined
}) => {
  const dispatch = useDispatch()
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const toggleModal = () => {
    setShowModal("" , "" , "");
  };
  const handleConfirmation = () => {
    if(restaurantDetails &&  date && tableId &&  timeSlotId && restaurantDetails._id){
      const bookingDetails = {
        restaurantId : restaurantDetails._id,
        restaurantName : restaurantDetails.restaurantName,
        time,
        guests : selectedGuests,
        date,
        tableId,
        timeSlotId,
        tableRate : restaurantDetails.TableRate
      }
      dispatch(confirmBooking(bookingDetails))
      navigate("/reserve-table");
    }
  };
  return (
    <>
      {isModalOpen && (
        <div
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-gray-500 bg-opacity-35 flex justify-center items-center"
        >
          <div className="relative p-4 w-[20%] max-w-md bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Complete reservation
              </h3>
              <button
                onClick={toggleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="max-h-auto flex flex-col gap-5 p-5">
              <h1 className="text-xl font-bold">
                {restaurantDetails?.restaurantName}
              </h1>
              <p className="text-sm text-neutral-700 font-bold">Date: {date}</p>
              <p className="text-sm text-neutral-700 font-bold">Time: {time}</p>
              <p className="text-sm text-neutral-700 font-bold">
                Guests :{selectedGuests}
              </p>
              {isAuthenticated && role == "user" ? (
                <button
                  className="bg-orange-500 p-2 rounded-lg hover:bg-orange-400 text-white font-bold"
                  onClick={handleConfirmation}
                >
                  Confirm your reservation
                </button>
              ) : (
                <Link to="/login">
                  <button className="bg-red-500 p-2 rounded-lg hover:bg-red-400 text-white font-bold ">
                    Please login
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlotConfrimationModal;
