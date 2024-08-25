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
import toast from "react-hot-toast";
interface userDatatype {
  email: string;
  username: string;
  _id: string;
  isPrimeMember: boolean;
  primeSubscription: {
    membershipId: {
      discount : number
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
         console.log(res.data.userData)
        setUser(res.data.userData);
      })
      .catch(({ response }) => {
        console.log(response?.data?.message);
      });
  }, [bookingDetails, id, navigate]);

  const calculatedAmount = () => {
    if (!bookingDetails) {
      return;
    }

    let amount: number =
      parseInt(bookingDetails.tableRate) * bookingDetails.guests;
    if (userData?.isPrimeMember) {
      const discountAmount = (amount * userData.primeSubscription.membershipId.discount) / 100;
      const price = amount - discountAmount
      return price.toFixed(2);
    }
    if (discount > 20) {
      const price = amount - discountPrice;
      return price.toFixed(2);
    }
    const discountAmount = (amount * discount) / 100;
    const price = amount - discountAmount
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
      toast.success("Coupon added ...")
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
    const restaurantDatas = {
      restaurantId: bookingDetails?.restaurantId,
      price: calculatedAmount(),
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
        localStorage.setItem("%stat%", "true");
        dispatch(resetBooking());
        stripe?.redirectToCheckout({
          sessionId: res.data.sessionId,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleMethodChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    setPaymentMethod(e.target.value);
  };
  const discountPriceFunction = ()=>{
    const price = (parseInt(bookingDetails?.tableRate as string) || 0) * (bookingDetails?.guests || 0) - (parseFloat(calculatedAmount() || "0"));
    return price.toFixed(2)
  }
  
  return (
    <>
      <section className="max-w-5xl mx-auto p-6 m-10 bg-white shadow-lg rounded-lg ">
        <h3 className="text-2xl font-bold mb-4">Booking Confirmation</h3>
        <div className="flex gap-10 pb-5">
          <div className=" w-[500px] h-[600px] flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <p className="text-base font-bold text-gray-600 flex items-center gap-1">
                <RiUserLine size={18} />
                Name : {name}
              </p>
              <p className="text-base font-bold text-gray-600 flex items-center gap-1">
                <IoMdTimer size={20} />
                Time : {bookingDetails?.time}
              </p>
              <p className="text-base font-bold text-gray-600 flex items-center gap-1">
                <MdDateRange size={20} />
                Date : {bookingDetails?.date}
              </p>
            </div>
            {!userData?.isPrimeMember ? (
              <div className="flex flex-col gap-2">
                <p className="text-xl font-bold"> Add Coupon</p>
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
                    You have {userData.primeSubscription.membershipId.discount}% off!
                  </p>
                </div>
              </div>
            )}

            <h3 className="font-bold text-xl">Payment methods.</h3>
            <div className="flex gap-3 font-bold items-center">
              Online
              <input
                type="radio"
                name="radio-2"
                value="Online"
                className="radio radio-primary size-5 "
                onChange={handleMethodChange}
                defaultChecked
              />
              Wallet
              <input
                type="radio"
                name="radio-2"
                value="Wallet"
                onChange={handleMethodChange}
                className="radio radio-primary size-5"
              />
            </div>
            <div className="flex flex-col w-[80%] h-[200px] gap-3 shadow-xl shadow-gray-300 bg-gray-50">
              <div className="">
                <h1 className="text-center font-semibold text-gray-700 text-lg font-sans p-3 ">
                  Booking summary
                </h1>
                <div className="h-[0.2px]  bg-gray-400" />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex justify-between">
                  <p className=" text-sm font-semibold">
                    {bookingDetails?.guests} Person X{" "}
                    {bookingDetails?.tableRate}
                  </p>
                  <p className="text-sm">
                    ₹{" "}
                    {parseInt(bookingDetails?.tableRate as string) *
                      (bookingDetails?.guests as number)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className=" text-sm font-semibold">Discount :</p>
                  <p className="text-sm">
                    - ₹{" "}
                    {discountPriceFunction()}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <p className="px-5 font-bold">Total</p>
                <p className="px-5 font-bold">₹ {calculatedAmount()}</p>
              </div>
            </div>
          </div>
          <div className="shadow-lg w-[400px] h-[500px] rounded-3xl p-5">
            <img
              src={bookingDetails?.tableImage}
              alt="tableImage"
              className="rounded-t-xl"
            />
            <section>
              <h2 className="text-base font-bold mb-4 pt-5">
                Table : {bookingDetails?.tableName}{" "}
              </h2>
              <p className="text-base font-bold mb-4">
                Seats : {bookingDetails?.guests}
              </p>
              <p className="text-base font-bold mb-4">Loaction : Outdoor</p>
              <p className="text-base font-bold mb-4">
                Description : Lorem ipsum dolor sit amet, consectetur
                adipisicing elit. Aut, inventore!
              </p>
            </section>
          </div>
        </div>
        <div>
          <button
            className="btn btn-success w-full text-white font-bold text-base"
            onClick={makePayment}
          >
            Confirm payment
          </button>
        </div>
      </section>
    </>
  );
};

export default ReserveTableConfirmation;
