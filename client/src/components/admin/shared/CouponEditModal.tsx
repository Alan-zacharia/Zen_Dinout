import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios";
import { AxiosError } from "axios";
import { CouponDetailsType } from "../../../types/admin";
import moment from "moment";
import toast from "react-hot-toast";
import { getTodayDate } from "../../../utils/dateValidateFunctions";
import { validateForm } from "../../../utils/validations";

interface CouponEditModalProps {
  open: boolean;
  onClose: () => void;
  coupon: CouponDetailsType | null;
  onEdit: () => void;
}

const CouponEditModal: React.FC<CouponEditModalProps> = ({
  open,
  onClose,
  coupon,
  onEdit,
}) => {
  const [formData, setFormData] = useState<CouponDetailsType | null>(null);
  const [editButtonShow, setEditButtonShow] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (coupon) {
      setFormData({ ...coupon });
    }
  }, [coupon]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditButtonShow(false);
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async () => {
    if (formData && validateForm(formData, setErrors)) {
      try {
        await axiosInstance.put(`/admin/coupons/${formData._id}`, { formData });
        onEdit();
        onClose();
        setEditButtonShow(true);
        toast.success("updated successfully...");
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.error(
            error.response?.data?.message ?? "Something went wrong..."
          );
        } else {
          toast.error("Something went wrong...");
        }
      }
    }
  };

  if (!open || !formData) return null;

  const formattedStartDate = moment(formData.startDate).format("YYYY-MM-DD");
  const formattedExpiryDate = moment(formData.expiryDate).format("YYYY-MM-DD");

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-3 p-4 sm:mx-auto shadow-xl relative">
        <button
          onClick={() => {
            onClose(), setEditButtonShow(true);
          }}
          className="p-1 px-3 bg-red-500 rounded-full absolute right-2 top-2 text-white"
        >
          X
        </button>

        <form className="p-4">
          <div className="mb-4">
            <label
              htmlFor="couponCode"
              className="block font-bold mb-1 text-sm sm:text-base"
            >
              Coupon Code
            </label>
            <input
              type="text"
              id="couponCode"
              name="couponCode"
              placeholder="Enter coupon code"
              className={`input input-bordered h-[35px] sm:h-[40px] w-full ${
                errors.couponCode ? "border-red-500" : ""
              }`}
              value={formData.couponCode}
              onChange={handleChange}
            />
            {errors.couponCode && (
              <p className="text-red-500 text-xs">{errors.couponCode}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="description"
              className="block font-bold mb-0.5 text-sm sm:text-base"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter description..."
              className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                errors.description ? "border-red-500" : ""
              }`}
              rows={3}
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-xs">{errors.description}</p>
            )}
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="minPurchase"
                className="block font-bold mb-0.5 text-sm sm:text-base"
              >
                Minimum Purchase
              </label>
              <input
                type="text"
                id="minPurchase"
                name="minPurchase"
                placeholder="Enter minimum purchase amount"
                className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                  errors.minPurchase ? "border-red-500" : ""
                }`}
                value={formData.minPurchase}
                onChange={handleChange}
              />
              {errors.minPurchase && (
                <p className="text-red-500 text-xs">{errors.minPurchase}</p>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="discount"
                className="block font-bold mb-0.5 text-sm sm:text-base"
              >
                Discount %
              </label>
              <input
                type="text"
                id="discount"
                name="discount"
                placeholder="Enter discount %..."
                className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                  errors.discount ? "border-red-500" : ""
                }`}
                value={formData.discount}
                onChange={handleChange}
              />
              {errors.discount && (
                <p className="text-red-500 text-xs">{errors.discount}</p>
              )}
              <label
                htmlFor="discountPrice"
                className="block font-bold mb-0.5 text-sm sm:text-base"
              >
                Discount Amount
              </label>
              <input
                type="text"
                id="discountPrice"
                name="discountPrice"
                placeholder="Enter discount amount..."
                className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                  errors.discountPrice ? "border-red-500" : ""
                }`}
                value={formData.discountPrice}
                onChange={handleChange}
              />
              {errors.discountPrice && (
                <p className="text-red-500 text-xs">{errors.discountPrice}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="startDate"
                className="block font-bold mb-0.5 text-sm sm:text-base"
              >
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                  errors.dateRange ? "border-red-500" : ""
                }`}
                value={formattedStartDate}
                onChange={handleChange}
                min={getTodayDate()}
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label
                htmlFor="expiryDate"
                className="block font-bold mb-0.5 text-sm sm:text-base"
              >
                End Date
              </label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                className={`input input-bordered w-full h-[35px] sm:h-[40px] ${
                  errors.expiryDate ? "border-red-500" : ""
                }`}
                value={formattedExpiryDate}
                onChange={handleChange}
                min={getTodayDate()}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-xs">{errors.expiryDate}</p>
              )}
            </div>
          </div>
          {errors.dateRange && (
            <p className="text-red-500 text-xs">{errors.dateRange}</p>
          )}
        </form>

        <div className="flex items-center justify-center gap-5">
          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full disabled:btn-accent"
            disabled={editButtonShow}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CouponEditModal;
