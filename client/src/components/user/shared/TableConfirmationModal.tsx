import React from "react";
import { useDispatch } from "react-redux";
import { confirmBooking } from "../../../redux/user/tableBookingSlice";
import { useNavigate } from "react-router-dom";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableDetails: {
    tableNumber: string;
    geustCount: number;
    tableImage: string;
    restaurantId: string;
    selectedDate: string;
    selectedTime: string;
    restaurantName: string;
    tableRatePerPerson: string;
    tableId: string;
    timeSlotId: string;
  };
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  tableDetails,
  onConfirm,
}) => {
  if (!isOpen || !tableDetails) return null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleConfirmation = () => {
    const bookingDetails = {
      restaurantId: tableDetails.restaurantId,
      restaurantName: tableDetails.restaurantName,
      time: tableDetails.selectedTime,
      guests: tableDetails.geustCount,
      date: tableDetails.selectedDate,
      tableId: tableDetails.tableId,
      tableRate: tableDetails.tableRatePerPerson,
      timeSlotId: tableDetails.timeSlotId,
      tableName: tableDetails.tableNumber,
      tableImage : tableDetails.tableImage  
    };
    dispatch(confirmBooking(bookingDetails));
    navigate(
      `/reserve-table?guest=${bookingDetails.guests}&date=${bookingDetails.date}&time=${bookingDetails.time}`
    );
    onConfirm();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Confirm Reservation</h2>
        <div className="mb-4">
          <img
            className="object-cover h-32 w-full"
            src={tableDetails.tableImage}
            alt="Table"
          />
        </div>
        <p className="mb-2 font-bold text-neutral-700">
          Table Number:{" "}
          <span className="mb-2 font-bold text-black">
            {tableDetails.tableNumber}
          </span>
        </p>
        <p className="mb-2 font-bold text-neutral-700">
          Guests:{" "}
          <span className="mb-2 font-bold text-black">
            {tableDetails.geustCount}
          </span>
        </p>
        <p className="mb-2 font-bold text-neutral-700">
          Time :{" "}
          <span className="mb-2 font-bold text-black">
            {tableDetails.selectedTime}
          </span>
        </p>
        <p className="mb-2 font-bold text-neutral-700">
          Date :{" "}
          <span className="mb-2 font-bold text-black">
            {tableDetails.selectedDate}
          </span>
        </p>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-1 px-4 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded"
            onClick={handleConfirmation}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
