import React from "react";
import { Link } from "react-router-dom";

const BookingCancel = () => {
  return (
    <div className="h-screen flex ">
      <div className=" flex m-auto shadow-lg shadow-gray-400 rounded-xl w-[25%] h-[50%]">
        <div className="m-auto flex flex-col gap-7  ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="400"
            height="200"
            viewBox="0 0 48 48"
            className="h-20 text-red-500"
          >
            <path
              fill="#f44336"
              d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
            ></path>
            <path
              fill="#fff"
              d="M29.656,15.516l2.828,2.828l-14.14,14.14l-2.828-2.828L29.656,15.516z"
            ></path>
            <path
              fill="#fff"
              d="M32.484,29.656l-2.828,2.828l-14.14-14.14l2.828-2.828L32.484,29.656z"
            ></path>
          </svg>
          <div className="flex flex-col w-[300px] m-auto">
            <h1 className="text-2xl font-bold font-sans text-center">
              Booking Canceled{" "}
            </h1>
          </div>
          <div className="flex m-auto pt-5">
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

export default BookingCancel;
