import React, { ChangeEvent, useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { MdTableRestaurant } from "react-icons/md";
import { MdDateRange } from "react-icons/md";
import { FaUserGroup } from "react-icons/fa6";
import axiosInstance from "../../api/axios";
import { toast } from "react-hot-toast";
import { formatDate } from "../../utils/dateValidateFunctions";
interface Booking {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  table: {
    tableNumber : string
  };
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
  guestCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
const SingleReservationDetailedView: React.FC = () => {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<Booking>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { bookingId } = useParams();
  const [statusData, setStatusChange] = useState<string | undefined>(
    bookingDetails?.bookingStatus
  );
  const [isDisabled , setIsDisabled] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      axiosInstance
        .get(`/restaurant/reservations/${bookingId}`)
        .then((res) => {
          setBookingDetails(res.data.bookingDetails);
          setIsLoading(false);
        })
        .catch(({ response }) => {
          setIsLoading(false);
          console.log(response);   
        });
    }, 500);
  }, []);
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const updateStatus = e.target.value;
    setStatusChange(updateStatus);
    setIsDisabled(false)
  };
  const handleUpdate = () => {
    axiosInstance
      .patch(`/restaurant/reservations/${bookingId}`, {
        statusData,
      })
      .then((res) => {
        console.log(res.data);
        setBookingDetails(res.data.bookingDetails);
        toast.success("Booking status updated successfully");
        navigate("/restaurant/reservations");
      })
      .catch(({ response }) => {
        console.log(response); 
      });
  };
  return (
    <>
      <div className="flex justify-center">
        <div className="h-[570px] shadow-lg w-[750px] p-5">
          <div className="text-left ">
            <h3 className=" text-xl font-bold">Update Reservation</h3>
            <div className="bg-black w-full h-[.5px] mt-3" />
          </div>
          {!isLoading ? (
            bookingDetails ? (
              <>
                <div>
                  <div className="flex gap-32 p-10">
                    <div className="flex flex-col gap-3">
                      <h4 className="text-lg font-bold">Booking Details</h4>
                      <div className="grid  gap-2">
                        <p className="font-bold text-gray-600">
                          Booking ID &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :
                        </p>
                        <p className="text-gray-800 font-semibold text-base ">
                          #{bookingDetails.bookingId}
                        </p>
                        <p className="font-bold text-gray-600">
                          Booking Status &nbsp;&nbsp; &nbsp; :
                        </p>
                        <select
                          className="select select-warning font-bold text-gray-600"
                          onChange={handleStatusChange}
                        >
                          <option
                            disabled
                            selected
                            className="text-gray-500 font-semibold"
                          >
                            {bookingDetails.bookingStatus.toLowerCase()}
                          </option>
                          {bookingDetails.bookingStatus !== "CANCELLED" && (
                            <>
                              {bookingDetails.bookingStatus !== "PENDING" && (
                                <option value={"PENDING"}>Pending</option>
                              )}
                              {bookingDetails.bookingStatus !== "COMPLETED" && (
                                <option value={"COMPLETED"}>Completed</option>
                              )}
                              {bookingDetails.bookingStatus !== "CONFIRMED" && (
                                <option value={"CONFIRMED"}>Confirmed</option>
                              )}
                              {bookingDetails.bookingStatus !== "CANCELLED" && (
                                <option value={"CANCELLED"}>Cancel</option>
                              )}
                              {bookingDetails.bookingStatus !== "CHECKED" && (
                                <option value={"CHECKED"}>Checked</option>
                              )}
                            </>
                          )}
                        </select>
                        <p className="font-bold text-gray-600">
                          Payment Method &nbsp;:
                        </p>
                        <p className="text-gray-500 font-semibold">
                          {bookingDetails?.paymentMethod} -{" "}
                          <span className={bookingDetails?.paymentStatus == "PAID" ? "text-green-500 font-bold": ""}>
                            {bookingDetails?.paymentStatus}
                          </span>
                        </p>
                        <p className="font-bold text-gray-600">
                          Total Amount &nbsp;&nbsp; &nbsp; &nbsp; :
                        </p>
                        <p className="text-gray-800 font-bold">
                          ₹ {bookingDetails.totalAmount}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-lg font-bold">Customer Details</h4>
                      <div className="grid  gap-4">
                        <p className="font-bold text-gray-600">
                          Name&nbsp; :{" "}
                          <span className="text-gray-700">
                            {bookingDetails.userId.username}
                          </span>
                        </p>

                        <p className="font-bold text-gray-600">
                          Email &nbsp; :{" "}
                          <span className="text-gray-700 font-bold">
                            {bookingDetails.userId.email}
                          </span>
                        </p>
                        <p className="font-bold text-gray-600 flex items-center">
                        <MdTableRestaurant size={25}/> &nbsp; : {" "}
                          <span className="text-gray-700">
                          &nbsp;{bookingDetails.table.tableNumber}
                          </span>
                        </p>

                        <p className="font-bold text-gray-600 flex items-center">
                          <MdDateRange size={25}/> &nbsp;&nbsp; :{" "}
                          <span className="text-gray-800">
                          &nbsp;{formatDate(bookingDetails.bookingDate)}
                          </span>
                        </p>

                        <p className="font-bold text-gray-600 flex items-center">
                          <FaUserGroup size={25}/> &nbsp;:{" "}
                          <span className="text-gray-800">
                          &nbsp; {bookingDetails.guestCount}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="font-bold bg-green-500 p-2 rounded-lg px-3 text-white hover:bg-green-600 disabled:bg-red-400"
                      onClick={handleUpdate}
                      disabled={isDisabled}>
                      Update
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center pt-20">
                <h2 className="text-xl font-bold">No reservation Details...</h2>
              </div>
            )
          ) : (
            <div
              role="status"
              className="flex gap-2 w-full space-y-8 animate-pulse md:space-y-0 md:space-x-8 "
            >
              <div className="flex flex-col p-5 gap-6 font-bold h-full w-1/2">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="flex flex-col p-5 gap-6 font-bold h-full w-1/2">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleReservationDetailedView;
