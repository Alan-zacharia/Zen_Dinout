import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

interface TimeSlot {
  _id?: string;
  date: string;
  time: string;
  isBooked?: boolean;
  maxTables: number;
  isAvailable?: boolean;
}

const TimeSlots: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [time, setTime] = useState("");
  const [availableTables, setAvailableTables] = useState<number | string>("");
  const [maxTables, setMaxTables] = useState<number | string>("");
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  const [slotPage, setSlotPage] = useState(0);
  const itemsPerPage = 6;

  useEffect(() => {
    const today = new Date();
    today.setHours(today.getHours() + 5);
    today.setMinutes(today.getMinutes() + 30);
    const indianDate = today.toISOString().split("T")[0];
    setSelectedDate(indianDate);
  }, []);

  const fetchTimeSlots = async (date: string) => {
    try {
      const response = await axiosInstance.get(`/restaurant/timeslots/${date}`);
      const timeSlots = response.data.map((slot: any) => {
        const timeInIST = new Date(slot.time).toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
        return {
          ...slot,
          time: timeInIST,
        };
      });
      setTimeSlots(timeSlots);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchTimeSlots(selectedDate);
    }
  }, [selectedDate]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setTime("");
    setAvailableTables("");
    setMaxTables("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const availableTablesNumber = Number(availableTables);
    const maxTablesNumber = Number(maxTables);
    if (isNaN(availableTablesNumber) || isNaN(maxTablesNumber)) {
      toast.error(
        "Please enter valid numbers for available tables and max tables."
      );
      return;
    }
    const newSlotData: TimeSlot = {
      date: selectedDate,
      time,  
      maxTables: maxTablesNumber,
    };
    try {
      const response = await axiosInstance.post("/restaurant/times", {
        newSlotData,
      });
      const timeInIST = new Date(response.data.newSlot.time).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        }
      );

      const updatedSlot = {
        ...response.data.newSlot,
        time: timeInIST,
      };

      setTimeSlots((prevSlots) => [...prevSlots, updatedSlot]);
      closeModal();
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.log("Error adding time slot:", error);
    }
  };

  const filteredSlots = timeSlots.filter((slot) => {
    const matchesSearchQuery = slot.time.includes(searchQuery);
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && slot.isAvailable) ||
      (availabilityFilter === "notAvailable" && !slot.isAvailable);

    return matchesSearchQuery && matchesAvailability;
  });

  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const paginatedSlots = filteredSlots.slice(
    slotPage * itemsPerPage,
    slotPage * itemsPerPage + itemsPerPage
  );

  const getDateHeading = () => {
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === today) {
      return "Today";
    } else {
      const dayName = new Date(selectedDate).toLocaleDateString("en-IN", {
        weekday: "long",
      });
      return dayName;
    }
  };

  const handleTimeSlotAvailable = (
    id: string | undefined,
    isAvailable: boolean | undefined
  ) => {
    axiosInstance
      .patch(`/restaurant/timeslots/${id}?available=${!isAvailable}`)
      .then(() => {
        setTimeSlots((prevSlots) =>
          prevSlots.map((slot) =>
            slot._id === id ? { ...slot, isAvailable: !isAvailable } : slot
          )
        );
        toast.success("Slot availability updated successfully!");
      })
      .catch(({ response }) => {
        console.log(response.data.message);
      });
  };
  return (
    <section className="lg:px-10 pt-16">
      <header className="flex justify-between w-[96%]">
        <h1 className="text-xl font-bold pb-10">Time Slots</h1>
        <div className="pt-6">
          <button
            onClick={openModal}
            className="p-2 bg-blue-500 rounded-lg text-white"
          >
            Add +
          </button>
        </div>
      </header>

      <div className="flex justify-between w-[95%] pb-5 items-center">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Search by time"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All</option>
            <option value="available">Available</option>
            <option value="notAvailable">Not Available</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between w-[95%] pb-5 items-center">
        <div></div>

        <div className="flex items-center">
          <span className="text-lg font-bold mr-2">Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <p className="text-lg font-bold px-3 text-blue-500">
            {getDateHeading()}
          </p>
        </div>
        <div></div>
      </div>

      <div className="overflow-x-auto w-[95%] border border-neutral-400">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200 text-left text-gray-600 text-lg">
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Max Tables</th>
              <th className="px-4 py-2">slot</th>
              <th className="px-4 py-2">Availability</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSlots.map((slot, index) => (
              <tr
                key={index}
                className="border-t border-gray-300 hover:bg-gray-100"
              >
                <td className="px-1 py-2">
                  <div className="bg-blue-500 px-2 text-sm w-20 font-bold py-2 rounded-lg text-white">
                    {slot.time}
                  </div>
                </td>
                <td className="px-4 py-4 font-bold">{slot.maxTables}</td>
                <td className="px-4 py-5 font-bold">
                  {slot.isBooked ? (
                    <p className="text-red-500">booked</p>
                  ) : (
                    <p className="text-green-500">slot - available</p>
                  )}
                </td>
                <td className="px-4 py-5 font-bold">
                  {slot.isAvailable ? (
                    <span
                      className="text-white bg-green-500 p-1.5 cursor-pointer rounded-lg font-bold"
                      onClick={() =>
                        handleTimeSlotAvailable(slot._id, slot.isAvailable)
                      }
                    >
                      Available
                    </span>
                  ) : (
                    <span
                      className="text-white bg-red-500 p-1.5 cursor-pointer rounded-lg font-bold"
                      onClick={() =>
                        handleTimeSlotAvailable(slot._id, slot.isAvailable)
                      }
                    >
                      Not Available
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <label>
                    <input type="checkbox" className="checkbox" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredSlots.length > itemsPerPage && (
        <div className="flex items-center justify-end w-[95%] pt-4">
          <button
            onClick={() => setSlotPage((prevPage) => Math.max(prevPage - 1, 0))}
            className="p-1 px-3 text-sm mx-1 bg-black text-white disabled:opacity-70"
            disabled={slotPage === 0}
          >
            Previous
          </button>
          <button
            onClick={() =>
              setSlotPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
            }
            className="p-1 px-3 text-sm mx-1 bg-black text-white disabled:opacity-70"
            disabled={slotPage === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add New Slot</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Date</span>
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Time</span>
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Max Tables</span>
                </label>
                <input
                  type="number"
                  value={maxTables}
                  onChange={(e) => setMaxTables(e.target.value)}
                  className="input input-bordered"
                  required
                />
              </div>
              <div className="modal-action">
                <button type="submit" className="btn">
                  Add
                </button>
                <button type="button" onClick={closeModal} className="btn">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default TimeSlots;
