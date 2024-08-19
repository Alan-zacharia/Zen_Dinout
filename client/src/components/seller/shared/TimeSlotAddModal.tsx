import { useFormik } from "formik";
import { useState } from "react";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";
import { validationSchema } from "../../../utils/validations";

interface TimeSlotAddModalProps {
  addTimeSlot: (newSlot: TimeSlotType) => void;
  timeSlots: TimeSlotType[];
}

interface TimeSlotType {
  startTime: string;
  endTime: string;
  _id: string;
  isAvailable: boolean;
}

 const convertToUTCWithOffset = (time: string, offsetHours: number, offsetMinutes: number): Date => {
  const date = new Date();
  if (time) {
    const [hours, minutes] = time.split(":").map(Number);
    date.setUTCHours(hours - offsetHours, minutes - offsetMinutes, 0, 0);
  }
  return date;
};


const formatTime = (time: string): string => {
  const date = new Date(time);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" , });
};

const TimeSlotAddModal: React.FC<TimeSlotAddModalProps> = ({
  addTimeSlot,
  timeSlots,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toggleModal = () => {
    setShowModal(!showModal);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      startTime: "",
      endTime: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const startTime = convertToUTCWithOffset(values.startTime,5,30).toISOString()
      const startDateTime = formatTime(startTime)
      if (
        timeSlots.some((slot) => {
          const existingStartTime = formatTime(slot.startTime);
          return startDateTime == existingStartTime;
        })
      ) {
        toast.error("Time slot with this start time already exists");
        return;
      }
      setIsLoading(true);
      axiosInstance
        .post("/restaurant/add-time-slot", { timeSlotData: values })
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
            addTimeSlot(response.data.addedSlot);
            setIsLoading(false);
            toggleModal();
          }, 500);
        })
        .catch(({ response }) => {
          setIsLoading(false);
          toast.error(response.data.message);
        });
    },
  });

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none  focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
      >
        <span className="font-bold text-lg">+</span>New Slot
      </button>
      {showModal && (
        <div
          id="table-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-200 bg-opacity-45 flex justify-center items-center"
        >
          <div className="m-auto bg-white rounded-xl w-[400px] flex shadow-xl flex-col">
            <div className="p-5 flex justify-between">
              <h4 className=" font-bold text-blue-500 font-sans">Time Slot</h4>
              <div>
                <button
                  className=" hover:bg-gray-300 text-black p-1"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3  h-3 "
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
            </div>
            <div className="h-[0.1px] bg-gray-300 w-full " />
            <div className="p-4 ">
              <form
                className="flex gap-3 flex-col"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex flex-col gap-4 mt-7">
                  <div className="flex flex-row gap-5  pb-5">
                    <div>
                      <label className="text-sm font-semibold block p-2 ">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="border border-gray-300 rounded-md p-2 px-7 outline-double"
                        {...formik.getFieldProps("startTime")}
                      />
                      {formik.errors.startTime &&
                        formik.submitCount > 0 &&
                        formik.touched.startTime && (
                          <div className="text-red-500 font-bold text-sm">
                            {formik.errors.startTime}
                          </div>
                        )}
                    </div>
                    <div>
                      <label className="text-sm block font-semibold p-2">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="border border-gray-300 rounded-md p-2 px-7 outline-double"
                        {...formik.getFieldProps("endTime")}
                      />
                      {formik.errors.endTime &&
                        formik.submitCount > 0 &&
                        formik.touched.endTime && (
                          <div className="text-red-500 font-bold text-sm">
                            {formik.errors.endTime}
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <button
                  className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 text-white font-bold"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading" : "Add new slot"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TimeSlotAddModal;
