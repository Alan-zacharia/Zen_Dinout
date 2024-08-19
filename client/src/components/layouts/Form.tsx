// import React, { useState } from "react";

// const Form = () => {
//   const [showModal, setShowModal] = useState(false);

//   const toggleModal = () => {
//     setShowModal(!showModal);
//   };

//   return (
//     <>
//       <button
//         onClick={toggleModal}
//         className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
//         type="button"
//       >
//         <span className="text-lg font-bold">+</span> Add Item
//       </button>

//       {showModal && (
//         <div
//           id="crud-modal"
//           tabIndex={-1}
//           aria-hidden="true"
//           className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
//         >
//           <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
//             <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
//               <h3 className="text-lg font-semibold text-gray-900">Add Item</h3>
//               <button
//                 onClick={toggleModal}
//                 type="button"
//                 className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
//               >
//                 <svg
//                   className="w-3 h-3"
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

//             <form className="p-4 md:p-6 h-full">
//               <div className="grid gap-4 mb-4 grid-cols-2 ">
//                 <div className="col-span-2">
//                   <label
//                     htmlFor="name"
//                     className="block mb-2 text-sm font-medium text-gray-900 "
//                   >
//                     Item name
//                   </label>
//                   <input

//                    name="item"
//                    id="item"
//                     type="text"
//                     placeholder="Item name"
//                     className="input input-bordered input-warning w-full max-w-xs"
//                   />
//                 </div>
//                 <div className="col-span-2 sm:col-span-1">
//                   <label
//                     htmlFor="price"
//                     className="block mb-2 text-sm font-medium text-gray-900 "
//                   >
//                     Price
//                   </label>
//                   <input
//                    type="number"
//                    name="price"
//                    id="price"

//                     placeholder="Type here"
//                     className="input input-bordered input-warning w-full max-w-xs"
//                   />
//                 </div>
//                 <div className="col-span-2 sm:col-span-1">
//                   <label
//                     htmlFor="category"
//                     className="block mb-2 text-sm font-medium text-gray-900 "
//                   >
//                     Select category
//                   </label>
//                   <select className="select select-warning w-full max-w-xs">
//                     <option disabled selected>
//                       Select category
//                     </option>
//                     <option>Cheese</option>
//                     <option>Veggie</option>
//                     <option>Pepperoni</option>
//                     <option>Margherita</option>
//                     <option>Hawaiian</option>
//                   </select>
//                 </div>
//                 <div className="col-span-2">
//                   <label
//                     htmlFor="name"
//                     className="block mb-2 text-sm font-medium text-gray-900 "
//                   >
//                     Item name
//                   </label>
//                   <input

//                    name="image"
//                    id="image"
//                     type="file"
//                     className="file-input file-input-bordered file-input-warning w-full max-w-xs"
//                   />
//                 </div>

//                 <div className="col-span-2 flex gap-4">
//                   <div className="col-span-2 sm:col-span-1">
//                     <label
//                       htmlFor="price"
//                       className="block mb-2 text-sm font-medium text-gray-900 "
//                     >
//                       Discount
//                     </label>
//                     <input
//                     type="number"
//                     name="discount"
//                     id="discount"
//                       placeholder="Discount"
//                       className="input input-bordered input-warning w-full max-w-xs"
//                     />
//                   </div>
//                   <div className="col-span-2 sm:col-span-1">
//                     <label
//                       htmlFor="tags"
//                       className="block mb-2 text-sm font-medium text-gray-900 "
//                     >
//                       Tags
//                     </label>
//                     <input

//                      name="tag"
//                      id="tag"
//                       type="text"
//                       placeholder="Tags"
//                       className="input input-bordered input-warning w-full max-w-xs"
//                     />
//                   </div>
//                 </div>
//                 <div className="form-control">
//                   <label className="cursor-pointer label">
//                     <span className="label-text text-lg font-bold">
//                       non-veg
//                     </span>
//                     <input type="checkbox" className="checkbox checkbox-warning" />
//                   </label>
//                 </div>
//               </div>
//               <button
//                 type="button"
//                 className="text-white w-full justify-center inline-flex items-center text-lg  hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-500font-medium rounded-lg  px-5 py-2.5 text-center btn btn-warning dark:hover:ring-yellow-500 dark:focus:ring-yellow-500"
//               >
//                 Save 🔥
//               </button>
//             </form>
//           </div>

//         </div>
//       )}
//     </>
//   );
// };

// export default Form;
import React, { ChangeEvent, useState } from "react";
import axiosInstance from "../../api/axios";
import { imageCloudUpload } from "../../services/SellerApiClient";

const Form: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const toggleModal = () => {
    setShowModal(!showModal);
    setItemImage(null);
    setError("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith("image/")) {
          setError("  ");
          setItemImage(null);
        } else {
          setItemImage(file);
          setError("");
        }
      }
    }
  };

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!itemImage) {
      setError("Please select an image.");
      return;
    }
    console.log(itemImage);
    // const res = await imageCloudUpload(itemImage as string);

    axiosInstance.post("/restaurant/upload-menu")
      .then((response) => {
        console.log("Upload successful:", response.data);
        toggleModal();
      })
      .catch((error) => {
        console.error("Error uploading:", error);
        setError("Failed to upload. Please try again.");
      });
  };

  return (
    <>
      <button
        onClick={toggleModal}
        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
        type="button"
      >
        <span className="text-lg font-bold">+</span> Add Menu
      </button>

      {showModal && (
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden bg-gray-500 bg-opacity-75 flex justify-center items-center"
        >
          <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">Add Menu</h3>
              <button
                onClick={toggleModal}
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
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

            <form className="p-4 md:p-6" onSubmit={handleSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="itemImage"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Item image
                  </label>
                  <input
                    name="itemImage"
                    id="itemImage"
                    type="file"
                    onChange={handleFileChange}
                    className="input input-bordered input-warning w-full max-w-xs"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="text-white w-full justify-center inline-flex items-center text-lg hover:bg-yellow-500 focus:ring-4 focus:outline-none focus:ring-yellow-500 font-medium rounded-lg px-5 py-2.5 text-center btn btn-warning dark:hover:ring-yellow-500 dark:focus:ring-yellow-500"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Form;
