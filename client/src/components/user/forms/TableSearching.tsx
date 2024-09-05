import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { SiGooglecalendar } from "react-icons/si";
import { getRestaurantTableSlot } from "../../../services/api";
import { TimeSlotType } from "../../../types/restaurantTypes";
import { getTodayDate } from "../../../utils/dateValidateFunctions";
import { RootState } from "../../../redux/store";
import toast from "react-hot-toast";

const TableSearching = () => {
  const formatTime = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.user
  );
  const [timeSlot, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [guestCount, setGuestCount] = useState<number>(0);
  const [timeSlotSelect, setTimeSlotSelect] = useState<string>("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    return today.toISOString().split("T")[0];
  });
  const { restaurantId } = useParams();
  const selectTableListRef = useRef<HTMLDivElement>(null);

  const handleDate = (e: ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };
  const handleGuestCount = () => {
    if (guestCount < 15) {
      setGuestCount((count) => count + 1);
    }
  };
  const handleGuestsCountReduce = () => {
    if (guestCount > 0) {
      setGuestCount((count) => count - 1);
    }
  };

  useEffect(() => {
    if (date) {
      getRestaurantTableSlot(restaurantId, date)
        .then((res) => {
          setTimeSlots(res.data.TimeSlots);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [date, restaurantId]);
  const handleTimeSlot = (time: string) => {
    setTimeSlotSelect(formatTime(time));
  };
  const handleComfirmation = () => {
    if (!isAuthenticated && role !== "user") {
      toast.error("Please login.......");
      return;
    }

    setTimeout(() => {
      selectTableListRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };
  return (
    <section>
      <form>
        <div className="flex xl:hidden px-5 pt-5 mt-20 flex-col gap-5 border w-full xl:w-[380px] max-h-auto  rounded-xl bg-white shadow-2xl">
          <div>
            <h4 className="text-xl font-bold pb-2">Select a Deal</h4>
            <div className="flex flex-col gap-2 w-80">
              <p className="text-sm font-semibold text-gray-600">Select Date</p>
              <div className="flex">
                <p className="bg-blue-500 h-14 w-14 items-center flex justify-center shadow-xl  rounded-l-lg shadow-neutral-200">
                  <SiGooglecalendar className="text-white " size={30} />
                </p>
                <input
                  type="date"
                  className="w-full rounded-r-lg h-14 p-5 bg-white-300 shadow-xl shadow-neutral-300 outline-none"
                  value={date}
                  onChange={handleDate}
                  min={getTodayDate()}
                />
              </div>
            </div>
          </div>

          <div></div>
          {!timeSlotSelect ? (
            <div className="flex flex-col gap-3 pb-5">
              <p className="text-sm font-semibold text-gray-600">Select Time</p>
              <div className="flex flex-wrap gap-5 w-80 h-36 overflow-auto ">
                {timeSlot && timeSlot.length > 0 ? (
                  timeSlot.map((value, index: number) => (
                    <p
                      key={index}
                      className="bg-blue-500 p-1 h-8 w-20 text-center font-bold cursor-pointer text-white rounded-md"
                      onClick={() => {
                        handleTimeSlot(value.time);
                      }}
                    >
                      {formatTime(value.time)}
                    </p>
                  ))
                ) : (
                  <div className="flex flex-col">
                    <div className="mx-16 m-6">
                      <p className="text-center text-xl font-bold">
                        No slots available
                      </p>
                      <span className="text-gray-500 text-sm px-4">
                        Please try again later
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col pb-5 ">
              <p className=" text-gray-700 text-base font-bold ">
                Selected Time &nbsp;&nbsp;:&nbsp; &nbsp;
                <span className="text-white bg-blue-500 p-1 text-sm rounded-md">
                  {timeSlotSelect}
                </span>
                <button
                  className="py-0.5 px-2 bg-red-500 rounded-lg text-white mx-8"
                  onClick={() => setTimeSlotSelect("")}
                >
                  X
                </button>
              </p>
              <div className="flex flex-wrap  w-80 h-[220px] overflow-auto ">
                {timeSlotSelect && (
                  <div className="flex flex-col gap-2 w-80">
                    <p className="text-sm font-semibold text-gray-600">
                      No of Guests
                    </p>
                    <div className="flex  items-center border shadow-lg h-10 gap-3  rounded-lg p-5">
                      <p className="text-gray-600 font-semibold">Guests :</p>
                      <button
                        className="border border-blue-500  rounded-full  w-5 h-5 flex items-center  justify-center focus:outline-none"
                        onClick={handleGuestCount}
                        type="button"
                      >
                        <span className="text-xl pb-1 text-blue-500 font-bold">
                          +
                        </span>
                      </button>
                      <p className="text-base font-medium ">{guestCount}</p>
                      <button
                        className="border border-blue-500  rounded-full pb-0.5  w-5 h-5 flex items-center  justify-center focus:outline-none"
                        onClick={handleGuestsCountReduce}
                        type="button"
                      >
                        <span className="text-xl pb-1 text-blue-500 font-bold">
                          -
                        </span>
                      </button>
                    </div>
                  </div>
                )}
                {guestCount > 0 && (
                  <button
                    className="w-full btn bg-red-500 text-white font-semibold rounded-md hover:bg-red-600"
                    type="button"
                    onClick={() => handleComfirmation()}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </form>
    </section>
  );
};

export default TableSearching;
