import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetBooking } from "../../redux/user/tableBookingSlice";
const BookingWalletStatus: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(resetBooking());
  return (
    <div className="h-screen flex ">
      <div className=" flex m-auto shadow-lg shadow-gray-400 rounded-xl w-[25%] h-[50%]">
        <div className="m-auto flex flex-col gap-7  ">
          <svg viewBox="0 0 24 24" className="h-20 text-green-500">
            <path
              fill="currentColor"
              d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
            ></path>
          </svg>
          <div className="flex flex-col w-[300px] m-auto">
            <h1 className="text-2xl font-bold font-sans text-center">
              Booking Succesfull{" "}
            </h1>
            <p className="text-center">Thank you for completing your payment</p>
          </div>
          <div className="flex gap-5 pt-5">
            <Link to="/account/?list_name=bookings">
              <button className="p-3 text-white font-bold bg-blue-700 rounded-lg hover:bg-blue-600">
                View Booking
              </button>
            </Link>
            <Link to="/">
              <button className="p-3 text-white font-bold bg-orange-500 rounded-lg w-44 hover:bg-orange-600">
                Go to home ?
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingWalletStatus;
