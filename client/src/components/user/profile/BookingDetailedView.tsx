import React, { useEffect, useState } from "react";
import NavBar from "../layouts/NavBar";
import { BsChatDotsFill } from "react-icons/bs";
import { BookingsHistory } from "../../../types/restaurantTypes";
import axiosInstance from "../../../api/axios";
import { isAxiosError } from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  MdDateRange,
  MdAccessTimeFilled,
  MdTableRestaurant,
  MdOutlineRestaurant,
  MdOutlinePayment,
} from "react-icons/md";
import { FaRupeeSign, FaUsers } from "react-icons/fa";
import {
  textColours,
  textPaymentStatusColours,
} from "../../../utils/dateValidateFunctions";
import { BookingsDetailedViewSkeleton } from "../../layouts/Shimmers";
import ConfirmationModal from "../layouts/ConfirmationModal";
interface BookingDetailedViewProps {
  bookingId: string;
}

const BookingDetailedView: React.FC<BookingDetailedViewProps> = ({
  bookingId,
}) => {
  const { id } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState<BookingsHistory | null>(
    null
  );
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      fetchBookingDetails();
    }, 1000);
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/booking-details/${bookingId}`
      );
      setBookingDetails(response.data.bookingData);
    } catch (error) {
      if (isAxiosError(error)) {
        console.log(error.message);
      }
    }
  };
  const handleChatSetup = async (restaurantId: string) => {
    try {
      const res = await axiosInstance.post("/api/inbox/", {
        senderId: id,
        receiverId: restaurantId,
      });
      const conversationId = res.data.savedConversation._id;
      navigate(`/chat?conversation=${conversationId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = format(date, "EEEE, MMMM do yyyy");
    return formattedDate;
  };

  const handleCancelBooking = (bookingId: string) => {
    axiosInstance
      .patch(`/api/booking-details/${bookingId}`)
      .then((res) => {
        fetchBookingDetails();
      })
      .catch(({ response }) => {
        console.log(response); 
      });
  };
  const handleOpenConfirmation = () => {
    setOpenConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };
  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>
      {bookingDetails ? (
        <div className="flex flex-col items-start gap-4 p-4 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-black">Booking Details</h1>
          <div className="h-[450px] p-5 w-full shadow-xl border flex justify-between">
            <ul className="flex flex-col p-5 gap-3 h-full w-1/2">
              <li className="font-bold text-lg flex gap-2 items-center">
                <img
                  src={bookingDetails.restaurantId.featuredImage.url}
                  alt="restaurant Image"
                  className="w-[300px] h-[150px]"
                />
              </li>
              <li className="font-bold text-lg flex gap-2 items-center">
                <MdOutlineRestaurant size={20} />
                {bookingDetails.restaurantId.restaurantName}
              </li>

              {bookingDetails.bookingDate && (
                <li className="flex items-center gap-2 font-semibold">
                  <MdDateRange /> {formatDate(bookingDetails.bookingDate)}
                </li>
              )}
              <li className="flex items-center gap-2 font-semibold">
                <MdAccessTimeFilled />
                {bookingDetails.bookingTime}
              </li>

              <li className="flex items-center gap-2 font-semibold">
                <FaUsers />
                {bookingDetails.guestCount} Guests
              </li>
              <li className="flex items-center gap-2 font-semibold">
                <MdTableRestaurant />
                {bookingDetails?.table?.tableNumber}
              </li>
              {bookingDetails.bookingStatus !== "CANCELLED" &&
                bookingDetails.bookingStatus !== "CHECKED" && (
                  <li className="flex items-center gap-2 font-semibold pt-2">
                    <button
                      className="bg-red-500 p-1 px-10 text-white font-bold hover:bg-red-600 rounded-md"
                      onClick={handleOpenConfirmation}
                    >
                      Cancel Booking
                    </button>
                    <ConfirmationModal
                      openConfirmation={openConfirmation}
                      onClose={handleCloseConfirmation}
                      onConfirm={() => {
                        handleCancelBooking(bookingDetails.bookingId as string);
                        handleCloseConfirmation();
                      }}
                    />
                  </li>
                )}
            </ul>

            <ul className="flex flex-col p-5 gap-3 font-bold h-full w-1/2">
              <li># {bookingDetails.bookingId}</li>
              <li className="gap-2 font-semibold">
                Payment status :{" "}
                <span
                  className={`font-bold ${textPaymentStatusColours(
                    bookingDetails.paymentStatus
                  )}`}
                >
                  {bookingDetails.paymentStatus}
                </span>
              </li>
              <li className="gap-2 font-bold flex items-center">
                <MdOutlinePayment size={25} />
                {bookingDetails.paymentMethod} Payment
              </li>
              <li className="gap-2 font-semibold">
                Booking status :{" "}
                <span className={textColours(bookingDetails.bookingStatus)}>
                  {bookingDetails.bookingStatus.toLowerCase()}
                </span>
              </li>
              <li className="flex gap-2 font-semibold">
                <div className="w-72 rounded-lg p-2 bg-neutral-100 h-32 flex flex-col gap-3">
                  <p className="text-base text-black">
                    Subtotal: ₹{" "}
                    {parseInt(bookingDetails.subTotal) *
                      bookingDetails.guestCount}
                  </p>
                  <p className="text-base text-black">
                    Discount: - ₹{" "}
                    {parseInt(bookingDetails.subTotal) *
                      bookingDetails.guestCount -
                      bookingDetails.totalAmount}
                  </p>
                  <p className="text-base text-black font-bold">
                    Total : ₹{bookingDetails.totalAmount}{" "}
                  </p>
                </div>
              </li>
            </ul>
          </div>
          <div className="container flex justify-end">
            <div
              className="tooltip border border-gray-200 shadow-lg bg-blue-400 rounded-full p-2.5 font-bold flex items-center gap-2 cursor-pointer"
              data-tip="Chat with restaurant"
              onClick={() =>
                handleChatSetup(bookingDetails?.restaurantId._id as string)
              }
            >
              <BsChatDotsFill size={18} className="font-bold text-white" />
              <p className="text-white">Chat with restaurant</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          role="status"
          className="flex gap-2 w-full space-y-8 animate-pulse md:space-y-0 md:space-x-8 "
        >
          <div className="flex flex-col p-5 gap-5 font-bold h-full w-1/2">
            <div className="h-44  flex justify-center items-center bg-gray-300 rounded">
              <svg
                className="w-10 h-10  text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
            <div className="h-5 bg-gray-200 rounded"></div>
          </div>
          <BookingsDetailedViewSkeleton />
        </div>
      )}
    </>
  );
};

export default BookingDetailedView;
