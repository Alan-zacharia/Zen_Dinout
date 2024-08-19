  // import { useFormik } from "formik";
  // import React, { useState, useEffect, useRef, useCallback } from "react";
  // import { MembershipPlanType } from "../../../types/admin";
  // import { validateMemberShipDetails } from "../../../utils/validations";
  // import axiosInstance from "../../../api/axios";
  // import toast from "react-hot-toast";

  // interface CouponAddModalProps {
  //   onCouponAdded: () => void;
  // }
  // const MembershipAddModal: React.FC<CouponAddModalProps> = ({
  //   onCouponAdded,
  // }) => {
  //   const [showModal, setShowModal] = useState<boolean>(false);
  //   const inputElement = useRef<HTMLInputElement | null>(null);
  //   const [isloading, setIsLoading] = useState<boolean>(false);
  //   useEffect(() => {
  //     if (showModal) {
  //       inputElement.current?.focus();
  //     }
  //   }, [showModal]);

  //   const formik = useFormik<MembershipPlanType>({
  //     initialValues: {
  //       planName: "",
  //       description: "",
  //       cost: 99,
  //       type: "",
  //       benefits : []
  //     },
  //     validationSchema: validateMemberShipDetails,
  //     onSubmit: async (data: MembershipPlanType) => {
  //       console.log(data);
  //       setIsLoading(true);
  //       axiosInstance
  //         .post("/admin/add-membership", data)
  //         .then((response) => {
  //           toast.success(response.data.message);
  //           setTimeout(() => {
  //             setIsLoading(false);
  //             onCouponAdded();
  //             toggleModal();
  //           }, 1000);
  //         })
  //         .catch(({ response }) => {
  //           console.log(response.message);
  //           setIsLoading(false);
  //           toast.error("Something went wrong..");
  //         });
  //     },
  //   });
  //   const toggleModal = useCallback(() => {
  //     setShowModal((prev) => !prev);
  //     formik.resetForm();
  //   }, [formik]);

  //   return (
  //     <>
  //       <button
  //         onClick={toggleModal}
  //         className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
  //       >
  //         <span className="font-bold text-lg">+</span>Add Plan
  //       </button>
  //       {showModal && (
  //         <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-80 flex justify-center items-center">
  //           <div className="bg-white rounded-xl max-w-md w-full mx-3 p-4  sm:mx-auto shadow-xl">
  //             <div className="p-3 sm:p-6 flex justify-between items-center border-b">
  //               <h4 className="font-bold text-black text-base sm:text-lg  ">
  //                 Add Membership
  //               </h4>
  //               <button
  //                 className="hover:bg-gray-300 text-black p-1"
  //                 onClick={toggleModal}
  //               >
  //                 <svg
  //                   className="h-3 w-3 sm:w-5 sm:h-5"
  //                   aria-hidden="true"
  //                   xmlns="http://www.w3.org/2000/svg"
  //                   fill="none"
  //                   viewBox="0 0 14 14"
  //                 >
  //                   <path
  //                     stroke="currentColor"
  //                     strokeLinecap="round"
  //                     strokeLinejoin="round"
  //                     strokeWidth="2"
  //                     d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
  //                   ></path>
  //                 </svg>
  //               </button>
  //             </div>
  //             <form onSubmit={formik.handleSubmit} className="p-4">
  //               <div className="mb-4">
  //                 <label
  //                   htmlFor="planName"
  //                   className="block font-bold mb-1 text-sm sm:text-base"
  //                 >
  //                   Plan name
  //                 </label>
  //                 <select
  //                   className="select select-bordered w-full max-w-xs"
  //                   {...formik.getFieldProps("planName")}
  //                 >
  //                   <option disabled selected value="">
  //                     Select plan name
  //                   </option>
  //                   <option value="Gold">Gold</option>
  //                   <option value="Platinum">Platinum</option>
  //                   <option value="Silver">Silver</option>
  //                 </select>
  //                 {formik.touched.planName &&
  //                   formik.errors.planName &&
  //                   formik.submitCount > 0 && (
  //                     <div className="text-red-500 font-bold text-sm">
  //                       {formik.errors.planName}
  //                     </div>
  //                   )}
  //               </div>

  //               <div className="mb-4">
  //                 <label
  //                   htmlFor="description"
  //                   className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
  //                 >
  //                   Description
  //                 </label>
  //                 <textarea
  //                   id="description"
  //                   placeholder="Enter description...."
  //                   className="input input-bordered w-full h-[35px] sm:h-[40px]"
  //                   {...formik.getFieldProps("description")}
  //                   rows={3}
  //                 ></textarea>
  //                 {formik.touched.description &&
  //                   formik.errors.description &&
  //                   formik.submitCount > 0 && (
  //                     <div className="text-red-500 font-bold text-sm">
  //                       {formik.errors.description}
  //                     </div>
  //                   )}
  //               </div>
  //               <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
  //                 <div className="w-full sm:w-1/2">
  //                   <label
  //                     htmlFor="membershipType"
  //                     className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
  //                   >
  //                     Membership Type
  //                   </label>
  //                   <select
  //                     className="select select-bordered w-full max-w-xs"
  //                     {...formik.getFieldProps("type")}
  //                   >
  //                     <option disabled selected value="">
  //                       Select Type
  //                     </option>
  //                     <option value="Monthly">Monthly</option>
  //                     <option value="Annual">Annual</option>
  //                   </select>
  //                   {formik.touched.type &&
  //                     formik.errors.type &&
  //                     formik.submitCount > 0 && (
  //                       <div className="text-red-500 font-bold text-sm">
  //                         {formik.errors.type}
  //                       </div>
  //                     )}
  //                 </div>
  //                 <div className="w-full sm:w-1/2">
  //                   <label
  //                     htmlFor="purchaseAmount"
  //                     className="block font-bold mb-0.5  sm:mb-1 text-sm sm:text-base"
  //                   >
  //                     Purchase amount
  //                   </label>
  //                   <input
  //                     type="text"
  //                     id="purchaseAmount"
  //                     placeholder="Enter amount.."
  //                     className="input input-bordered w-full h-[35px] sm:h-[40px]"
  //                     {...formik.getFieldProps("cost")}
  //                   />
  //                   {formik.touched.cost &&
  //                     formik.errors.cost &&
  //                     formik.submitCount > 0 && (
  //                       <div className="text-red-500 font-bold text-sm">
  //                         {formik.errors.cost}
  //                       </div>
  //                     )}
  //                 </div>
  //               </div>

  //               <div className=" w-full">
  //                 <button
  //                   type="submit"
  //                   className="bg-blue-500 hover:bg-blue-600 w-full text-white font-bold py-3 px-4 mt-5 sm:mt-0 rounded-lg"
  //                   disabled={isloading}
  //                 >
  //                   {isloading ? "Loading" : "Save"}
  //                 </button>
  //               </div>
  //             </form>
  //           </div>
  //         </div>
  //       )}
  //     </>
  //   );
  // };

  // export default React.memo(MembershipAddModal);

  import { useFormik } from "formik";
  import React, { useState, useEffect, useRef, useCallback } from "react";
  import { MembershipPlanType } from "../../../types/admin";
  import { validateMemberShipDetails } from "../../../utils/validations";
  import axiosInstance from "../../../api/axios";
  import toast from "react-hot-toast";
  
  interface CouponAddModalProps {
    onCouponAdded: () => void;
  }
  
  const MembershipAddModal: React.FC<CouponAddModalProps> = ({ onCouponAdded }) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const inputElement = useRef<HTMLInputElement | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
  
    useEffect(() => {
      if (showModal) {
        inputElement.current?.focus();
      }
    }, [showModal]);
  
    const formik = useFormik<MembershipPlanType>({
      initialValues: {
        planName: "",
        description: "",
        cost: 99,
        type: "",
        benefits: [""], // Initialize with one empty benefit
        discount: 0, 
      },
      validationSchema: validateMemberShipDetails,
      onSubmit: async (data: MembershipPlanType) => {
        setIsLoading(true);
        axiosInstance
          .post("/admin/add-membership", data)
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
  
    const handleBenefitChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
      const newBenefits = [...formik.values.benefits];
      newBenefits[index] = event.target.value;
      formik.setFieldValue("benefits", newBenefits);
    };
  
    const addBenefit = () => {
      formik.setFieldValue("benefits", [...formik.values.benefits, ""]);
    };
  
    const removeBenefit = (index: number) => {
      const newBenefits = formik.values.benefits.filter((_, i) => i !== index);
      formik.setFieldValue("benefits", newBenefits);
    };
  
    return (
      <>
        <button
          onClick={toggleModal}
          className="text-white bg-blue-400 hover:bg-blue-500 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 "
        >
          <span className="font-bold text-lg">+</span>Add Plan
        </button>
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-80 flex justify-center items-center">
            <div className="bg-white rounded-xl max-w-md w-full mx-3 p-4 sm:mx-auto shadow-xl">
              <div className="p-3 sm:p-6 flex justify-between items-center border-b">
                <h4 className="font-bold text-black text-base sm:text-lg">
                  Add Membership
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
                    htmlFor="planName"
                    className="block font-bold mb-1 text-sm sm:text-base"
                  >
                    Plan name
                  </label>
                  <select
                    className="select select-bordered w-full max-w-xs"
                    {...formik.getFieldProps("planName")}
                  >
                    <option value="" disabled>Select plan name</option>
                    <option value="Gold">Gold</option>
                    <option value="Platinum">Platinum</option>
                    <option value="Silver">Silver</option>
                  </select>
                  {formik.touched.planName && formik.errors.planName && formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.planName}
                    </div>
                  )}
                </div>
  
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block font-bold mb-0.5 sm:mb-1 text-sm sm:text-base"
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
                  {formik.touched.description && formik.errors.description && formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.description}
                    </div>
                  )}
                </div>
  
                <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="type"
                      className="block font-bold mb-0.5 sm:mb-1 text-sm sm:text-base"
                    >
                      Membership Type
                    </label>
                    <select
                      className="select select-bordered w-full max-w-xs"
                      {...formik.getFieldProps("type")}
                    >
                      <option value="" disabled>Select Type</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Annual">Annual</option>
                    </select>
                    {formik.touched.type && formik.errors.type && formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.type}
                      </div>
                    )}
                  </div>
  
                  <div className="w-full sm:w-1/2">
                    <label
                      htmlFor="cost"
                      className="block font-bold mb-0.5 sm:mb-1 text-sm sm:text-base"
                    >
                      Purchase amount
                    </label>
                    <input
                      type="number"
                      id="cost"
                      placeholder="Enter amount.."
                      className="input input-bordered w-full h-[35px] sm:h-[40px]"
                      {...formik.getFieldProps("cost")}
                    />
                    {formik.touched.cost && formik.errors.cost && formik.submitCount > 0 && (
                      <div className="text-red-500 font-bold text-sm">
                        {formik.errors.cost}
                      </div>
                    )}
                  </div>
                </div>
  
                <div className="mb-4">
                  <label
                    htmlFor="discount"
                    className="block font-bold mb-0.5 sm:mb-1 text-sm sm:text-base"
                  >
                    Discount
                  </label>
                  <input
                    type="number"
                    id="discount"
                    placeholder="Enter discount percentage"
                    className="input input-bordered w-full h-[35px] sm:h-[40px]"
                    {...formik.getFieldProps("discount")}
                  />
                  {formik.touched.discount && formik.errors.discount && formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.discount}
                    </div>
                  )}
                </div>
  
                <div className="mb-4">
                  <label
                    htmlFor="benefits"
                    className="block font-bold mb-1 text-sm sm:text-base"
                  >
                    Benefits
                  </label>
                  {formik.values.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        placeholder="Enter benefit..."
                        className="input input-bordered w-full"
                        value={benefit}
                        onChange={(e) => handleBenefitChange(index, e)}
                      />
                      {formik.values.benefits.length > 1 && (
                        <button
                          type="button"
                          className="text-red-500"
                          onClick={() => removeBenefit(index)}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                    onClick={addBenefit}
                  >
                    Add Benefit
                  </button>
                  {formik.touched.benefits && formik.errors.benefits && formik.submitCount > 0 && (
                    <div className="text-red-500 font-bold text-sm">
                      {formik.errors.benefits}
                    </div>
                  )}
                </div>
  
                <div className="w-full">
                  <button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-600 w-full text-white font-bold py-3 px-4 mt-5 sm:mt-0 rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading" : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };
  
  export default React.memo(MembershipAddModal);
  