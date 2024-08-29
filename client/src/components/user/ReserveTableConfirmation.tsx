import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdDateRange } from "react-icons/md";
import { IoMdTimer } from "react-icons/io";
import { RiUserLine } from "react-icons/ri";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../api/axios";
import { resetBooking } from "../../redux/user/tableBookingSlice";
import { useNavigate } from "react-router-dom";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { MdTableRestaurant, MdReduceCapacity } from "react-icons/md";
import { FaLocationPin } from "react-icons/fa6";
import toast from "react-hot-toast";

interface userDatatype {
  email: string;
  username: string;
  _id: string;
  isPrimeMember: boolean;
  primeSubscription: {
    membershipId: {
      discount: number;
    };
    status: string;
  };
}

const ReserveTableConfirmation = () => {
  const { id, name } = useSelector((state: RootState) => state.user);
  const { bookingDetails } = useSelector((state: RootState) => state.booking);
  const [coupon, setCoupon] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [discountPrice, setDiscountPrice] = useState<number>(0);
  const [couponError, setCouponError] = useState<string>("");
  const [userData, setUser] = useState<userDatatype | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("Online");
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!bookingDetails?.time) {
      navigate("/");
      return;
    }

    axiosInstance
      .get(`/api/account/${id}`)
      .then((res) => {
        setUser(res.data.userData);
      })
      .catch(({ response }) => {
        console.log(response?.data?.message);
      });
  }, [bookingDetails, id, navigate]);

  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const res = await axiosInstance.get("/api/wallet");
        setWalletBalance(res.data?.wallet?.balance);
      } catch (error) {
        console.log(error);
      }
    };
    fetchWalletBalance();
  }, []);

  const calculatedAmount = () => {
    if (!bookingDetails) {
      return;
    }

    let amount: number =
      parseInt(bookingDetails.tableRate) * bookingDetails.guests;
    if (userData?.isPrimeMember) {
      const discountAmount =
        (amount * userData.primeSubscription.membershipId.discount) / 100;
      const price = amount - discountAmount;
      return price.toFixed(2);
    }
    if (discount > 20) {
      const price = amount - discountPrice;
      return price.toFixed(2);
    }
    const discountAmount = (amount * discount) / 100;
    const price = amount - discountAmount;
    return price.toFixed(2);
  };

  const handleCouponData = (e: ChangeEvent<HTMLInputElement>) => {
    setCoupon(e.target.value);
  };

  const handleCoupon = async () => {
    if (!coupon || !bookingDetails) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    try {
      const res = await axiosInstance.post("/api/apply-coupon", {
        couponCode: coupon,
        minPurchase: parseInt(bookingDetails.tableRate) * bookingDetails.guests,
      });
      setDiscount(parseInt(res.data.discount));
      if (parseInt(res.data.discount) > 20) {
        setDiscountPrice(parseInt(res.data.discountPrice));
      }
      toast.success("Coupon added ...");
      setCouponError("");
    } catch (error: any) {
      setDiscount(0);
      setCouponError(error.response.data.message);
    }
  };

  const makePayment = async () => {
    if (!bookingDetails) {
      return;
    }
    const totalAmount = parseFloat(calculatedAmount() || "299");
    if (paymentMethod === "Wallet" && walletBalance !== null && walletBalance < totalAmount) {
      toast.error("Your wallet balance is not sufficient to complete this transaction.");
      return;
    }
    const restaurantDatas = {
      restaurantId: bookingDetails?.restaurantId,
      price: totalAmount,
      Capacity: bookingDetails?.guests,
      table: bookingDetails?.tableId,
      subTotal: bookingDetails.tableRate,
    };
    const stripe = await loadStripe(import.meta.env.VITE_API_STRIPE_KEY);
    await axiosInstance
      .post("/api/create-payment", {
        restaurantDatas,
        email: userData?.email,
        name: userData?.username,
        restaurantId: bookingDetails?.restaurantId,
        paymentMethod: paymentMethod,
        bookingTime: bookingDetails?.time,
        Date: bookingDetails.date,
        timeSlotId: bookingDetails.timeSlotId,
      })
      .then((res) => {
        localStorage.removeItem("%statphdyw%");
        if (paymentMethod == "Online" && res.data.sessionId) {
          dispatch(resetBooking());
          localStorage.setItem("%stat%", "true");
          stripe?.redirectToCheckout({
            sessionId: res.data.sessionId,
          });
        } else {
          navigate(`/booking-confirmed/${res.data.bookingId}`);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const discountPriceFunction = () => {
    const price =
      (parseInt(bookingDetails?.tableRate as string) || 0) *
        (bookingDetails?.guests || 0) -
      parseFloat(calculatedAmount() || "0");
    return price.toFixed(2);
  };

  return (
    <section className="max-w-5xl mx-auto p-6 m-4 bg-white shadow-lg rounded-lg">
      <h3 className="text-2xl font-bold mb-4">Booking Confirmation</h3>
      <div className="flex flex-col lg:flex-row gap-10 pb-5">
        <div className="w-full lg:w-[500px] h-full flex flex-col gap-7">
          <div className="flex flex-col gap-4">
            <p className="text-base font-bold text-gray-600 flex items-center gap-1">
              <RiUserLine size={18} />
              Name: {name}
            </p>
            <p className="text-base font-bold text-gray-600 flex items-center gap-1">
              <IoMdTimer size={20} />
              Time: {bookingDetails?.time}
            </p>
            <p className="text-base font-bold text-gray-600 flex items-center gap-1">
              <MdDateRange size={20} />
              Date: {bookingDetails?.date}
            </p>
          </div>
          {!userData?.isPrimeMember ? (
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold">Add Coupon</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="Enter coupon code..."
                  onChange={handleCouponData}
                />
                <button
                  className="bg-green-500 px-5 rounded-lg font-bold text-white"
                  onClick={handleCoupon}
                >
                  Add
                </button>
              </div>
              {couponError && (
                <p className="text-red-500 font-bold">{couponError}</p>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xl font-bold">You are a prime member.</p>
              <div className="flex gap-3">
                <p className="text-lg text-green-600 font-semibold">
                  You have {userData.primeSubscription.membershipId.discount}%
                  off!
                </p>
              </div>
            </div>
          )}

          <h3 className="font-bold text-xl">Payment methods.</h3>
          <p className="font-bold flex text-lg text-blue-500">
            Wallet Balance &nbsp;: &nbsp;{""}
            <span className="flex items-center font-semibold ">
              <FaIndianRupeeSign />
              {walletBalance?.toFixed(2)}
            </span>
          </p>
          <div className="flex gap-3 font-bold items-center">
            Wallet
            <input
              type="radio"
              name="radio-2"
              value="Wallet"
              onChange={handleMethodChange}
              className="radio radio-primary size-5"
            />
            Online
            <input
              type="radio"
              name="radio-2"
              value="Online"
              className="radio radio-primary size-5 "
              onChange={handleMethodChange}
              defaultChecked
            />
          </div>
          <div className="flex flex-col w-full h-auto gap-3 shadow-xl shadow-gray-300 bg-gray-50 p-4">
            <div className="">
              <h1 className="text-center font-semibold text-gray-700 text-lg font-sans p-3">
                Booking summary
              </h1>
              <div className="h-[0.2px] bg-gray-400" />
            </div>
            <div className="flex justify-between font-bold text-sm">
              <p>Total</p>
              <p className="flex items-center">
                <FaIndianRupeeSign />
                {bookingDetails &&
                  parseInt(bookingDetails?.tableRate || "0") *
                    bookingDetails?.guests}
              </p>
            </div>
            <div className="flex justify-between font-bold text-sm">
              <p>Discount</p>
              <p className="flex items-center">
                -<FaIndianRupeeSign />
                {discount > 20
                  ? discountPriceFunction()
                  : discountPriceFunction()}
              </p>
            </div>
            <div className="flex justify-between font-bold text-sm">
              <p>SubTotal</p>
              <p className="flex items-center">
                <FaIndianRupeeSign />
                {calculatedAmount()}
              </p>
            </div>
          </div>
          <button
            onClick={makePayment}
            className="mt-3 w-full bg-green-500 p-3 font-bold text-lg text-white rounded-lg shadow-xl hover:bg-green-600"
          >
            Confirm Reservation
          </button>
        </div>

        <div className="w-full lg:w-[350px] h-full">
          <div className="bg-white shadow-md p-4 rounded-lg h-full">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold">Reservation Details</p>
            </div>
            <img
              src={bookingDetails?.tableImage}
              alt="tableImage"
              className="rounded-t-xl"
            />
            <div className="flex flex-col">
              <h2 className="text-base font-bold pt-5">
                Restaurant : {bookingDetails?.restaurantName}{" "}
              </h2>
              <h2 className="text-base font-bold mb-4 pt-5 flex items-center gap-1">
                <MdTableRestaurant /> Table : {bookingDetails?.tableName}{" "}
              </h2>
              <p className="text-base font-bold mb-4 flex items-center gap-1">
                <MdReduceCapacity /> Seats : {bookingDetails?.guests}
              </p>
              <p className="text-base font-bold mb-4 flex gap-1 items-center">
                <FaLocationPin />
                Loaction : Outdoor
              </p>
              <p className="text-base font-bold flex items-center">
                Price per Guest : <FaIndianRupeeSign />{" "}
                {bookingDetails?.tableRate}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReserveTableConfirmation;
