import React from "react";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";
interface TimeSlotType {
    startTime: string;
    endTime: string;
    _id: string;
    isAvailable : boolean
  }
interface ConfirmationModalProps {
    openConfirmation: boolean;
    onClose: () => void;
    onConfirm: () => void;
    timeSlotId : string;
    setTimeSlots: React.Dispatch<React.SetStateAction<TimeSlotType[]>>;
  };
  
const confrimationModal : React.FC<ConfirmationModalProps>  = ({
    openConfirmation,
    onClose,
    onConfirm,
    timeSlotId,
    setTimeSlots,
  }) => {
      if (!openConfirmation ) return null;
      const handleRemoveTimeSlot = () => {
        axiosInstance
          .delete(`/restaurant/delete-timeSlot/${timeSlotId}`)
          .then((response) => {
            toast.success("Slot removed successfully...");
            setTimeSlots(prevSlots=>prevSlots.filter(slot=>slot._id !== timeSlotId));
            onConfirm();
          })
          .catch(({ response }) => {
            console.log(response);
          });
      };
      return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-4  pt-8 pb-8 rounded-lg">
            <div className="p-4">
              <p className="text-lg font-bold mb-2 flex justify-center">
                Are you sure to remove  time slot ....! 
               
              </p>
            </div>
            <div className="flex justify-center pt-2 gap-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg mr-2"
                onClick={() => {
                  handleRemoveTimeSlot()
                }}
              >
                Confirm
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-8 py-3 rounded-lg"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    
}

export default confrimationModal
