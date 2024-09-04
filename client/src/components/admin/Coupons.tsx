import React, { useCallback, useEffect, useState } from "react";
import CouponAddModal from "./shared/CouponAddModal";
import CouponEditModal from "./shared/CouponEditModal";
import axiosInstance from "../../api/axios";
import { CouponDetailsType } from "../../types/admin";
import { FaIndianRupeeSign } from "react-icons/fa6";
import { formatDate } from "../../utils/dateValidateFunctions";
import ConfirmationModal from "./shared/ConfirmationModal";

const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponDetailsType[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [selectedCoupon, setSelectedCoupon] =
    useState<CouponDetailsType | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = () => {
    axiosInstance
      .get("/admin/coupons")
      .then((res) => {
        setCoupons(res.data.Coupons);
      })
      .catch(({ response }) => {
        console.log(response);
      });
  };

  const handleOpenConfirmation = useCallback((coupon: CouponDetailsType) => {
    setOpenConfirmation(true);
    setSelectedCoupon(coupon);
  }, []);

  const handleOpenEdit = useCallback((coupon: CouponDetailsType) => {
    setOpenEdit(true);
    setSelectedCoupon(coupon);
  }, []);

  return (
    <>
      <ConfirmationModal
        openConfirmation={openConfirmation}
        onClose={() => setOpenConfirmation(false)}
        onConfirm={() => {
          setOpenConfirmation(false);
          fetchCoupons();
        }}
        coupon={selectedCoupon}
      />
      <CouponEditModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        coupon={selectedCoupon}
        onEdit={fetchCoupons}
      />
      <div className="text-gray-900">
        <div className="p-4 flex justify-between lg:pb-16">
          <h1 className="hidden lg:flex lg:text-3xl font-bold">
            Coupon Management
          </h1>
          <h1 className="text-2xl flex lg:hidden lg:text-3xl font-bold ">
            Coupons
          </h1>
          <div className="flex justify-end">
            <CouponAddModal onCouponAdded={fetchCoupons} />
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-base text-white uppercase bg-gray-900 h-16">
              <tr>
                <th scope="col" className="px-6 py-3"></th>
                <th scope="col" className="px-6 py-3">
                  Coupon Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Discount %
                </th>
                <th scope="col" className="px-6 py-3">
                  Discount Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Min purchase
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Start Date
                </th>
                <th scope="col" className="px-6 py-3">
                  End date
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {coupons && coupons.length > 0 ? (
                coupons.map((coupon, index) => (
                  <tr
                    className="bg-white border-b border-b-black dark:border-gray-700 text-black font-bold text-[14.5px]"
                    key={index}
                  >
                    <td className="px-6 py-4">
                      <div className="form-control">
                        <label className="cursor-pointer label">
                          <input
                            type="checkbox"
                            className="checkbox checkbox-error"
                            onClick={() => handleOpenConfirmation(coupon)}
                            checked={false}
                          />
                        </label>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 text-gray-900 whitespace-nowrap"
                    >
                      {coupon.couponCode}
                    </th>
                    <td className="px-6 py-4">{coupon.discount} %</td>
                    <td className="px-6 py-4">
                      <span className="items-center flex">
                        <FaIndianRupeeSign />
                        {coupon.discountPrice}.00
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="items-center flex">
                        <FaIndianRupeeSign />
                        {coupon.minPurchase}.00
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        className="p-2 outline-none cursor-default"
                        value={coupon.description}
                        disabled
                      />
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(coupon.startDate as string)}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(coupon.expiryDate as string)}
                    </td>
                    <td className="px-6 py-4 ">
                      {coupon.isActive ? (
                        <p className="text-green-600 p-2 ">Active</p>
                      ) : (
                        <p className="text-red-600">Expired</p>
                      )}
                    </td>
                    <td className="px-6 py-4 ">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleOpenEdit(coupon)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-white border-b border-b-gray-400 text-black text-lg font-bold">
                  <td colSpan={10} className="p-4 text-center">
                    No coupons found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default React.memo(Coupons);
