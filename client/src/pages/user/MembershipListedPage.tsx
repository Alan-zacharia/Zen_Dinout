// import React, { useState, useEffect } from "react";
// import axiosInstance from "../../api/axios";
// import { loadStripe } from "@stripe/stripe-js";
// import toast from "react-hot-toast";

// export interface Membership {
//   _id: string;
//   planName: string;
//   description: number;
//   type: string;
//   cost: number;
//   benefits: string[];
//   discount: number;
// }

// const MembershipListedPage: React.FC = () => {
//   const [memberships, setMemberships] = useState<Membership[]>([]);
//   const [existingMembership, setExistingMembership] = useState<Membership | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const fetchMemberships = async () => {
//       try {
//         const res = await axiosInstance.get("/api/memberships");
//         const memberships = res.data.memberships || [];
//         const existingMembership = res.data.existingMembership || null;

//         if (memberships.length === 0) {
//           setExistingMembership(existingMembership);
//         } else {
//           setMemberships(memberships);
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error(error);
//         setLoading(false);
//       }
//     };
//     fetchMemberships();
//   }, []);

//   const handlePayment = async (membershipId: string) => {
//     try {
//       const stripe = await loadStripe(import.meta.env.VITE_API_STRIPE_KEY);
//       const res = await axiosInstance.post("/api/create-membership-payment", {
//         membershipId,
//       });
//       await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleCancel = async (membershipId: string) => {
//     try {
//       const res = await axiosInstance.put("/api/cancel-membership", {
//         membershipId,
//       });
//       toast.success(res.data.message);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <section className="py-10 px-4 lg:px-80 min-h-screen">
//       <h1 className="text-2xl font-bold text-gray-900 mb-6">Membership Plans</h1>
//       <div className="flex flex-wrap gap-6">
//         {loading ? (
//           <div className="w-full text-center text-xl font-semibold text-gray-700">Loading...</div>
//         ) : (
//           <>
//             {existingMembership ? (
//               <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
//                 <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                   {existingMembership.planName}
//                 </h5>
//                 <div className="flex items-baseline mb-4">
//                   <span className="text-3xl font-semibold text-gray-900 dark:text-white">₹</span>
//                   <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
//                     {existingMembership.cost}
//                   </span>
//                   <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2">
//                     /{existingMembership.type}
//                   </span>
//                 </div>
//                 <div className="flex items-baseline mb-4">
//                   <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                     Discount:
//                   </span>
//                   <span className="text-3xl font-extrabold text-green-500 dark:text-green-400 ml-2">
//                     {existingMembership.discount}%
//                   </span>
//                 </div>
//                 <ul className="space-y-3 mb-6">
//                   <li className="text-lg font-semibold text-gray-900 dark:text-white">Benefits:</li>
//                   {existingMembership.benefits.map((benefit, index) => (
//                     <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
//                       <svg
//                         className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
//                         aria-hidden="true"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="currentColor"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//                       </svg>
//                       {benefit}
//                     </li>
//                   ))}
//                 </ul>
//                 <button
//                   type="button"
//                   className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700"
//                   onClick={() => handleCancel(existingMembership._id)}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             ) : memberships.length > 0 ? (
//               memberships.map((membership) => (
//                 <div
//                   key={membership._id}
//                   className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
//                 >
//                   <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
//                     {membership.planName}
//                   </h5>
//                   <div className="flex items-baseline mb-4">
//                     <span className="text-3xl font-semibold text-gray-900 dark:text-white">₹</span>
//                     <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
//                       {membership.cost}
//                     </span>
//                     <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2">
//                       /{membership.type}
//                     </span>
//                   </div>
//                   <div className="flex items-baseline mb-4">
//                     <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
//                       Discount:
//                     </span>
//                     <span className="text-3xl font-extrabold text-green-500 dark:text-green-400 ml-2">
//                       {membership.discount}%
//                     </span>
//                   </div>
//                   <ul className="space-y-3 mb-6">
//                     <li className="text-lg font-semibold text-gray-900 dark:text-white">Benefits:</li>
//                     {membership.benefits.map((benefit, index) => (
//                       <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
//                         <svg
//                           className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
//                           aria-hidden="true"
//                           xmlns="http://www.w3.org/2000/svg"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                         >
//                           <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
//                         </svg>
//                         {benefit}
//                       </li>
//                     ))}
//                   </ul>
//                   <button
//                     type="button"
//                     className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
//                     onClick={() => handlePayment(membership._id)}
//                   >
//                     Buy Plan
//                   </button>
//                 </div>
//               ))
//             ) : (
//               <div className="w-full text-center text-xl font-bold text-gray-700 dark:text-gray-400 mt-32">
//                 No memberships found
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </section>
//   );
// };

// export default MembershipListedPage;
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import moment from "moment"; // For date formatting
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";

export interface Membership {
  _id: string;
  planName: string;
  description: string;
  type: string;
  cost: number;
  benefits: string[];
  discount: number;
}

const MembershipListedPage: React.FC = () => {
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [existingMembership, setExistingMembership] =
    useState<Membership | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { id } = useSelector((state: RootState) => state.user);

  const fetchMemberships = async () => {
    try {
      const res = await axiosInstance.get(`/api/membership/${id}`);
      const memberships = res.data.memberships || [];
      const existingMembership = res.data.existingMembership || null;
      if (memberships.length === 0) {
        setExistingMembership(existingMembership);
      } else {
        setMemberships(memberships);
      }

      const userRes = await axiosInstance.get(`/api/account/${id}`);
      setExpirationDate(userRes.data.userData.primeSubscription.endDate);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMemberships();
  }, []);

  const handlePayment = async (membershipId: string) => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_API_STRIPE_KEY); 
      const res = await axiosInstance.post("/api/membership", {
        membershipId,
      });
      await stripe?.redirectToCheckout({ sessionId: res.data.sessionId });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancel = async (membershipId: string) => {
    try {
      const res = await axiosInstance.delete(`/api/membership/${membershipId}`);
      toast.success(res.data.message);
      setExistingMembership(null)
      setTimeout(()=>{
        fetchMemberships()
      },500)
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to cancel membership"
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <section className="py-10 px-4 lg:px-80 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Membership Plans
      </h1>
      <div className="flex flex-wrap gap-6">
        {loading ? (
          <div className="w-full text-center text-xl font-semibold text-gray-700">
            Loading...
          </div>
        ) : (
          <>
            {existingMembership ? (
              <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {existingMembership.planName}
                </h5>
                <div className="flex items-baseline mb-4">
                  <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                    ₹
                  </span>
                  <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    {existingMembership.cost}
                  </span>
                  <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2">
                    /{existingMembership.type}
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Discount:
                  </span>
                  <span className="text-3xl font-extrabold text-green-500 dark:text-green-400 ml-2">
                    {existingMembership.discount}%
                  </span>
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Expiration Date:
                  </span>
                  <span className="text-lg font-medium text-gray-900 dark:text-white ml-2">
                    {expirationDate
                      ? moment(expirationDate).format("MMMM D, YYYY")
                      : "N/A"}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="text-lg font-semibold text-gray-900 dark:text-white">
                    Benefits:
                  </li>
                  {existingMembership.benefits.map((benefit, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-600 dark:text-gray-400"
                    >
                      <svg
                        className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-700"
                  onClick={() => handleCancel(existingMembership._id)}
                >
                  Cancel
                </button>
              </div>
            ) : memberships.length > 0 ? (
              memberships.map((membership) => (
                <div
                  key={membership._id}
                  className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
                >
                  <h5 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {membership.planName}
                  </h5>
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl font-semibold text-gray-900 dark:text-white">
                      ₹
                    </span>
                    <span className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      {membership.cost}
                    </span>
                    <span className="text-xl font-medium text-gray-600 dark:text-gray-400 ml-2">
                      /{membership.type}
                    </span>
                  </div>
                  <div className="flex items-baseline mb-4">
                    <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                      Discount:
                    </span>
                    <span className="text-3xl font-extrabold text-green-500 dark:text-green-400 ml-2">
                      {membership.discount}%
                    </span>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="text-lg font-semibold text-gray-900 dark:text-white">
                      Benefits:
                    </li>
                    {membership.benefits.map((benefit, index) => (
                      <li
                        key={index}
                        className="flex items-center text-gray-600 dark:text-gray-400"
                      >
                        <svg
                          className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700"
                    onClick={() => handlePayment(membership._id)}
                  >
                    Buy Now
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full text-center text-xl font-semibold text-gray-700">
                No memberships available
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default MembershipListedPage;
