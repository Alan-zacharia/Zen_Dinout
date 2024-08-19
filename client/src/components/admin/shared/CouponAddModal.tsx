import { useFormik } from "formik";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { CouponDetailsType } from "../../../types/admin";
import { validateCouponDetails } from "../../../utils/validations";
import { getTodayDate } from "../../../utils/dateValidateFunctions";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

interface CouponAddModalProps {
  onCouponAdded: () => void;
}
const CouponAddModal: React.FC<CouponAddModalProps> = ({ onCouponAdded }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [isloading, setIsLoading] = useState<boolean>(false);
  useEffect(() => {
    if (showModal) {
      inputElement.current?.focus();
    }
  }, [showModal]);

  const formik = useFormik<CouponDetailsType>({
    initialValues: {
      couponCode: "",
      description: "",
      minPurchase: 100,
      discount: 10,
      discountPrice: 50,
      startDate: new Date(),
      expiryDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    },
    validationSchema: validateCouponDetails,
    onSubmit: async (data: CouponDetailsType) => {
      setIsLoading(true);
      axiosInstance
        .post("/admin/add-coupon", data)
        .then((response) => {
          toast.success(response.data.message);
          setTimeout(() => {
            setIsLoading(false);
            onCouponAdded();
            toggleModal();
          }, 1000);
        })
        .catch(({ response }) => {
          console.log(response.message);
          setIsLoading(false);
          toast.error("Something went wrong..");
        });
    },
  });
  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
    formik.resetForm();
  }, [formik]);

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
      >
        <span className="font-bold text-lg">+</span>Add Coupon
      </button>
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-80 flex justify-center items-center">
          <div className="bg-white rounded-xl max-w-md w-full mx-3 p-4  sm:mx-auto shadow-xl">
            <div className="p-3 sm:p-6 flex justify-between items-center border-b">
              <h4 className="font-bold text-black text-base sm:text-lg  ">
                Add Coupon
              </h4>
              <button
                className="hover:bg-gray-300 text-black p-1"
                onClick={toggleModal}
              >
                <svg
                  className="h-3 w-3 sm:w-5 sm:h-5"
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
            <form onSubmit={formik.handleSubmit} className="p-4">
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
                  ref={inputElement}
                  placeholder="Enter coupon code"
                  className="input input-bordered  h-[35px] sm:h-[40px] w-full"
                  {...formik.getFieldProps("couponCode")}
                />
                {formik.touched.couponCode &&
                  formik.errors.couponCode &&
                  formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.couponCode}
                    </div>
                  )}
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Enter description...."
                  className="input input-bordered w-full h-[35px] sm:h-[40px]"
                  {...formik.getFieldProps("description")}
                  rows={3}
                ></textarea>
                {formik.touched.description &&
                  formik.errors.description &&
                  formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.description}
                    </div>
                  )}
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="minPurchase"
                    className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
                  >
                    Minimum Purchase
                  </label>
                  <input
                    type="text"
                    id="minPurchase"
                    placeholder="Enter minimum purchase amount"
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("minPurchase")}
                  />
                  {formik.touched.minPurchase &&
                    formik.errors.minPurchase &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.minPurchase}
                      </div>
                    )}
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="discount"
                    className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
                  >
                    Discount %
                  </label>
                  <input
                    type="text"
                    id="discount"
                    placeholder="Enter discount %..."
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("discount")}
                  />
                  {formik.touched.discount &&
                    formik.errors.discount &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.discount}
                      </div>
                    )}
                      <label
                    htmlFor="discount"
                    className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
                  >
                  Discount amount 
                  </label>
                  <input
                    type="text"
                    id="discount"
                    placeholder="Enter discount amount..."
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("discountPrice")}
                  />
                  {formik.touched.discountPrice &&
                    formik.errors.discountPrice &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.discountPrice}
                      </div>
                    )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4 sm:mb-4">
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="startDate"
                    className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("startDate")}
                    min={getTodayDate()}
                  />
                  {formik.touched.startDate &&
                    formik.errors.startDate &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.startDate}
                      </div>
                    )}
                </div>
                <div className="w-full sm:w-1/2">
                  <label
                    htmlFor="expiryDate"
                    className="block font-bold mb-0.1 sm:mb-1 text-sm sm:text-base"
                  >
                    End Date
                  </label>
                  <input
                    type="date"
                    id="expiryDate"
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("expiryDate")}
                    min={getTodayDate()}
                  />
                  {formik.touched.expiryDate &&
                    formik.errors.expiryDate &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.expiryDate}
                      </div>
                    )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mt-5 sm:mt-0 rounded-lg"
                  disabled={isloading}
                >
                  {isloading ? "Loading" : "Add Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(CouponAddModal);
