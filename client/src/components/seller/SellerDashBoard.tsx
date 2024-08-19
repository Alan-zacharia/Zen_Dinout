import React, { useEffect, useState } from "react";
import SellerChartOne from "./SellerChartOne";
import ChartTwo from "./ChartTwo";
import { BookingDetailsType } from "../../types/restaurantTypes";
import axiosInstance from "../../api/axios";
import { Link } from "react-router-dom";
import { textColours } from "../../utils/dateValidateFunctions";
import { format } from 'date-fns';

interface Booking {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  tableSlotId: string;
  restaurantId: {
    _id: string;
    restaurantName: string;
  };
  bookingTime: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: string;
  totalAmount: number;
  bookingDate: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const SellerDashBoard = () => {
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
  useEffect(() => {
    axiosInstance
      .get("/restaurant/reservations/")
      .then((res) => {
        console.log(res.data.Reservations);
        setBookingDetails(res.data.Reservations.slice(0,4));
      })
      .catch(({ response }) => {
        console.log(response);
      });
  }, []);
 
  return (
    <div className="container px-4 py-8 ">
      <div className="overflow-hidden">
        <div className="pt-10 text-center">
          <h1 className="text-xl font-bold flex justify-start">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          <div className="bg-white shadow-lg shadow-gray-400 rounded-lg">
            <SellerChartOne />
            <h5 className="text-center font-bold text-blue-500">Revenue</h5>
          </div>
          <div className="bg-white shadow-lg shadow-gray-400">
            <ChartTwo />
            <h5 className="text-center font-bold text-blue-500 pt-10">
              Booking statistics
            </h5>
          </div>
        </div>
        <div className="pt-5">
          <h1 className="text-xl font-bold text-center flex justify-start pt-5">
            Recent bookings
          </h1>
          <div className="pt-4 overflow-x-auto shadow- shadow-black">
            <table className="table border-2 mx-auto">
              <thead>
                <tr className="font-bold text-sm text-black">
                  <th>Booking Id</th>
                  <th>Name</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Table size</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookingDetails && bookingDetails.length > 0 ? (
                  bookingDetails.map((bookingDetails) => {
                    return (
                      <tr className="border-b-2 border-b-blue-200 font-semibold">
                        <td>
                          <p>{bookingDetails.bookingId.substring(0, 12)}...</p>
                        </td>
                        <td>{bookingDetails.userId.username}</td>
                        <td>{bookingDetails.bookingTime}</td>
                        <td>{format(new Date(bookingDetails.bookingDate), 'dd-MM-yyyy')}</td>
                        <td>{bookingDetails.restaurantId.restaurantName}</td>

                        <td
                          className={`font-bold ${textColours(
                            bookingDetails.bookingStatus                            
                          )}`}
                        >
                          {bookingDetails.bookingStatus.toLocaleLowerCase()}
                        </td>
                        <th>
                          <Link
                            to={`/restaurant/reservations/view/${bookingDetails.bookingId}`}
                          >
                            <button className="btn btn-ghost btn-xs">
                              details
                            </button>
                          </Link>
                        </th>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center">
                      <h1 className="text-xl font-bold text-gray-600">
                        No Reservations Available
                      </h1>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashBoard;
