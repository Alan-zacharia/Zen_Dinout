import React from "react";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

interface ConfirmationModalProps {
  openConfirmation: boolean;
  onClose: () => void;
  onConfirm: () => void;
  coupon: {
    couponCode: string;
    couponId: string;
  } | null;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  openConfirmation,
  onClose,
  onConfirm,
  coupon,
}) => {
  if (!openConfirmation || !coupon) return null;
  const handleCouponRemove = () => {
    axiosInstance
      .delete(`/admin/coupons/${coupon.couponId}`)
      .then((res) => {
        toast.success("Coupon deleted....");
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white w-full max-w-md p-4  pt-8 pb-8 rounded-lg">
        <div className="p-4">
          <p className="text-lg font-bold mb-2">
            Are you sure to delete the coupon :{" "}
            <span className=" font-semibold">{coupon.couponCode}</span> ?
          </p>
        </div>
        <div className="flex justify-center pt-2 gap-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg mr-2"
            onClick={() => {
              handleCouponRemove();
              onConfirm();
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
};

export default ConfirmationModal;
