import React, { useEffect, useState } from "react";
import axiosInstance from "../../../api/axios";
import { MembershipPlanType } from "../../../types/admin";

interface MembershipCardsProps {
  mount: boolean;
}

const MembershipCards: React.FC<MembershipCardsProps> = ({ mount }) => {
  const [memberships, setMemberships] = useState<MembershipPlanType[]>([]);

  useEffect(() => {
    axiosInstance
      .get("/admin/memberships")
      .then(({ data }) => {
        setMemberships(data.memberships);
      })
      .catch(({ response }) => {
        console.error(response);
      });
  }, [mount]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {memberships && memberships.length > 0 ? (
        memberships.map((membership) => (
          <div
            className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            key={membership._id}
          >
            <h5 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              {membership.planName}
            </h5>
            <div className="flex items-baseline mb-2">
              <span className="text-2xl font-semibold text-gray-900 dark:text-white">
                ₹
              </span>
              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                {membership.cost}
              </span>
              <span className="ml-2 text-base font-medium text-gray-500 dark:text-gray-400">
                {membership.type}
              </span>
            </div>
            <div className="flex items-baseline mb-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Discount:
              </span>
              <span className="ml-1 text-base font-medium text-green-500 dark:text-green-400">
                {membership.discount}%
              </span>
            </div>
            <ul className="space-y-2">
              <li className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                Benefits:
              </li>
              {membership.benefits.map((benefit, index) => (
                <li className="flex items-center" key={index}>
                  <svg
                    className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center text-black">
          No memberships available.
        </div>
      )}
    </div>
  );
};

export default MembershipCards;
