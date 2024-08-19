import React, { useState, useEffect } from "react";
import TimeSlotAddModal from "./shared/TimeSlotAddModal";
import ConfrimationModal from "./shared/ConfirmationDeleteModal";
import axiosInstance from "../../api/axios";
import { MdDelete } from "react-icons/md";
import toast from "react-hot-toast";
import RestrictionAddModal from "./TimeSlotDetailedView";
interface TimeSlotType {
  startTime: string;
  endTime: string;
  _id: string;
  isAvailable: boolean;
}
const TimeSlots: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotType[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [timeSlotId, setTimeSlotId] = useState<string>("");
  const [openRestrictionModal, setOpenRestrictionModal] =
    useState<boolean>(false);

  const handleRestrictionAdded = () => {

  };
  useEffect(() => {
    axiosInstance
      .get("/restaurant/get-time-slots")
      .then((res) => {
        setTimeSlots(res.data.timeSlots);
      })
      .catch(({ response }) => {
        console.log(response.data);
      });
  }, []);

  const formatTime = (time: string): string => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  const addTimeSlot = (newSlot: TimeSlotType) => {
    setTimeSlots((prevSlots) => [newSlot, ...prevSlots]);
  };

  const handleOpenConfirmation = (timeSlotId: string) => {
    setOpenConfirmation(true);
    setTimeSlotId(timeSlotId);
  };
  const handleTimeSlotAvailable = async (
    timeSlotId: string,
    newAvailabilityStatus: boolean
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/restaurant/timeslots/${timeSlotId}/availability`,
        { isAvailable: !newAvailabilityStatus }
      );
      toast.success(res.data.message);
      setTimeSlots((prevData) =>
        prevData.map((slot) =>
          slot._id === timeSlotId
            ? { ...slot, isAvailable: !newAvailabilityStatus }
            : slot
        )
      );
    } catch (error) {
      toast.error("Something went wrong please try again later......");
      console.log(error);
    }
  };

  return (
    <>
      <ConfrimationModal
        onClose={() => setOpenConfirmation(false)}
        onConfirm={() => {
          setOpenConfirmation(false);
        }}
        openConfirmation={openConfirmation}
        timeSlotId={timeSlotId}
        setTimeSlots={setTimeSlots}
      />
      <div className=" lg:w-[700px]  w-screen lg:mx-10 mt-10  relative ">
        <div className="pt-10">
          <h1 className="text-xl font-bold mx-5">Time Slots</h1>
          <div className="flex justify-end">
            <TimeSlotAddModal addTimeSlot={addTimeSlot} timeSlots={timeSlots} />
          </div>

          <div className="overflow-x-auto w-full no-scrollbar  md:overflow-x-hidden lg:h-[630px] lg:w-[700px]  shadow-xl border border-gray-200">
            {timeSlots && timeSlots.length ? (
              <table className="table table-lg table-pin-rows w-[700px] md:w-full  md:table-pin-cols">
                <thead>
                  <tr className="text-base font-bold text-black">
                    <th>SL No.</th>
                    <td>Time</td>
                    <td>IsAvailable</td>
                    <td>Action</td>
                    <td>Remove</td>
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot, index) => (
                    <tr className="font-bold text-base" key={index}>
                      <th>{index + 1}</th>
                      <td>
                        {formatTime(slot.startTime)} -{" "}
                        {formatTime(slot.endTime)}
                      </td>
                      <td>
                        <button
                          className={`${
                            slot.isAvailable
                              ? " bg-green-500 hover:bg-green-600  "
                              : "bg-red-500 hover:bg-red-600 "
                          } text-white font-bold px-5 p-2 rounded-lg text-xs`}
                          onClick={() =>
                            handleTimeSlotAvailable(slot._id, slot.isAvailable)
                          }
                        >
                          {slot.isAvailable ? " Available" : "Not Available"}
                        </button>
                      </td>
                      <td>
  
                      </td>
                      <td onClick={() => handleOpenConfirmation(slot._id)}>
                        <MdDelete
                          className="text-red-500 cursor-pointer"
                          size={22}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="table-fixed w-full font-bold text-gray-600">
                <tbody>
                  <tr>
                    <td
                      colSpan={3}
                      className="h-60 flex justify-center items-center"
                    >
                      <p className="text-black font-bold text-lg">
                        No time slots added
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
          <button
            className="bg-black px-5 rounded-lg text-white p-2 text-xs"
            onClick={() => setOpenRestrictionModal(true)}
          >
            {" "}
            Add{" "}
          </button>
        </div>
      </div>
      {openRestrictionModal && (
        <RestrictionAddModal
          open={openRestrictionModal}
          onClose={() => setOpenRestrictionModal(false)}
          onRestrictionAdded={handleRestrictionAdded}
        />
      )}
    </>
  );
};

export default TimeSlots;
// import React, { useState } from 'react';
// import axios from 'axios';

// const TimeSlotForm = () => {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [availableTables, setAvailableTables] = useState('');
//   const [maxTables, setMaxTables] = useState('');
//   const restaurantId = "8huh"
//   const handleSubmit = async ( e : any) => {
//     e.preventDefault();
//     try {
//       await axios.post('/api/timeslots', {
//         restaurantId,
//         date,
//         time,
//         availableTables,
//         maxTables,
//       });
//       alert('Time slot added successfully');
//     } catch (error) {
//       console.error('Error adding time slot:', error);
//       alert('Failed to add time slot');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//       <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
//       <input type="number" placeholder="Available Tables" value={availableTables} onChange={(e) => setAvailableTables(e.target.value)} required />
//       <input type="number" placeholder="Max Tables" value={maxTables} onChange={(e) => setMaxTables(e.target.value)} required />
//       <button type="submit">Add Time Slot</button>
//     </form>
//   );
// };

// export default TimeSlotForm;
