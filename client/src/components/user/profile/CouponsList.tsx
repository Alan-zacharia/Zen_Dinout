import React, { useState, useEffect } from "react";
import { CouponType } from "../../../types/userTypes";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";
import {format} from "date-fns"
const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponType[]>([]);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axiosInstance.get("/api/coupons");
        setCoupons(res.data.coupons);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCoupons();
  }, []);

  const handleCopy = (couponCode: string) => { 
    navigator.clipboard.writeText(couponCode)
    toast.success("Coupon code copied to clipboard!");
  };

  return (
    <div className="p-8 flex flex-col gap-4 w-[350px] ">
      {coupons && coupons.length === 0 ? (
        <p className="text-gray-500 font-bold">No Coupons found.</p>
      ) : (
        coupons.map((coupon) => (
          <div
            className="shadow-md w-full h-32 rounded-lg p-4 flex justify-between items-center bg-white border border-gray-200 hover:shadow-lg transition-shadow"
            key={coupon._id}
          >
            <div>
              <p className="text-2xl font-bold text-indigo-600">
                {coupon.couponCode}
              </p>
              <p className="text-gray-600 mt-2">
                Discount: <span className="font-medium">{coupon.discount}%</span>
              </p>
              <p className="text-gray-600 mt-1">{coupon.description}</p>
              <p className="text-gray-600 text-sm">
                Valid Until : <span className="text-red-500">{format(new Date(coupon.expiryDate),"dd-MM-yyyy")}</span>
              </p>
            </div>
            <div>
              <button
                onClick={() => handleCopy(coupon.couponCode)}
                className="px-3 py-1.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition"
              >
                Copy
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Coupons;
