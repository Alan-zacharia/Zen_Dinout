import { useFormik } from "formik";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { tableSlotTypes } from "../../../types/restaurantTypes";
import { toast, Toaster } from "react-hot-toast";
import { restaurantTableValidationSchema } from "../../../validations/restaurantValidationSchema";
import axiosInstance from "../../../api/axios";

interface TableCreateModalProps {
  tableDatas: tableSlotTypes[];
  MountAfterUpdate: (newTableSlot: tableSlotTypes) => void;
}

const TableCreateModal: React.FC<TableCreateModalProps> = ({
  MountAfterUpdate,
  tableDatas,
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | ArrayBuffer | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    inputElement.current?.focus();
  }, [showModal]);

  const formik = useFormik({
    initialValues: {
      tableImage: "",
      tableId: "",
      tableNumber: "",
      tableCapacity: 2,
      tableLocation: "",
    },
    validationSchema: restaurantTableValidationSchema,
    onSubmit: async (tableAddingDatas, { resetForm }) => {
      setLoading(true);
      try {
        const isDuplicateTableNumber = tableDatas.some(
          (table) =>
            table.tableNumber === tableAddingDatas.tableNumber &&
            table.tableLocation === tableAddingDatas.tableLocation
        );
        if (isDuplicateTableNumber) {
          toast.error("Table name already exists.");
          return;
        }

        const formData = new FormData();
        formData.append("tableId", tableAddingDatas.tableId);
        formData.append("tableNumber", tableAddingDatas.tableNumber);
        formData.append(
          "tableCapacity",
          String(tableAddingDatas.tableCapacity)
        );
        formData.append("tableLocation", tableAddingDatas.tableLocation);
        formData.append("tableImage", tableAddingDatas.tableImage);

        const res = await axiosInstance.post("/restaurant/tables", formData);
        toast.success(res.data.message);
        setShowModal(false);
        resetForm();
        MountAfterUpdate(res.data.newTable);
      } catch (error) {
        console.log(error); 
      } finally {
        setLoading(false);
      }
    },
  });

  const handleImageChange = (file: File) => {
    setImageError("");
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageError("Please upload a valid image file.");
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setImageError("File size must be less than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
      formik.setFieldValue("tableImage", file);
    }
  };

  const toggleModal = useCallback(() => {
    setShowModal((prev) => !prev);
    setImage(null);
    formik.resetForm();
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <button
        onClick={toggleModal}
        className="text-white bg-black hover:bg-black focus:outline-none  text-xs focus:ring-yellow-300 font-medium rounded-full lg:text-sm px-6 py-2 text-center me-2 mb-2 dark:focus:ring-yellow-900"
      >
        <span className="font-bold text-lg">+</span>Add
      </button>
      {showModal && (
        <div
          id="table-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-200 bg-opacity-45 flex justify-center items-center"
        >
          <div className="m-auto bg-white rounded-xl max-h-md flex shadow-xl flex-col">
            <div className="p-5 flex justify-between">
              <h4 className=" font-bold text-black font-sans">Add Table</h4>
              <div>
                <button
                  className=" hover:bg-gray-300 text-black p-1"
                  onClick={toggleModal}
                >
                  <svg
                    className="w-3  h-3 "
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
            </div>
            <div className="h-[0.1px] bg-gray-300 w-full" />
            <div className="p-4">
              <form
                className="flex gap-3 flex-col"
                onSubmit={formik.handleSubmit}
              >
                <label className="text-black font-bold">Table Image</label>
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="fileInput"
                    className="relative cursor-pointer"
                  >
                    <div className="w-full h-44 border-4 border-dashed border-gray-400  flex items-center justify-center overflow-hidden">
                      {image ? (
                        <img
                          src={image as string}
                          alt="Uploaded"
                          className="object-fill w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-500">Upload Image</span>
                      )}
                    </div>
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageDataChange}
                    className="hidden"
                  />
                  {formik.touched.tableImage &&
                    formik.submitCount > 0 &&
                    formik.errors.tableImage && (
                      <div className="text-red-500 font-semibold">
                        {formik.errors.tableImage}
                      </div>
                    )}
                  {imageError && (
                    <div className="text-red-500">{imageError}</div>
                  )}
                </div>
                <div className="flex flex-row gap-36">
                  <label htmlFor="Tabel_number" className="block font-bold ">
                    Table
                  </label>
                  <label htmlFor="Tabel_number" className="block font-bold">
                    Capacity
                  </label>
                </div>
                <div className="flex  gap-2">
                  <input
                    type="text"
                    ref={inputElement}
                    placeholder="Table number"
                    className="input input-bordered outline-none focus:border-none  w-full max-w-xs"
                    {...formik.getFieldProps("tableNumber")}
                  />

                  <select
                    className="select select-bordered outline-none focus:border-none  w-full max-w-xs font-semibold"
                    {...formik.getFieldProps("tableCapacity")}
                  >
                    <option disabled selected>
                      Table Capacity
                    </option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value="10">10</option>
                  </select>
                </div>
                {formik.touched.tableNumber &&
                  formik.submitCount > 0 &&
                  formik.errors.tableNumber && (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.tableNumber}
                    </div>
                  )}
                <label htmlFor="Location" className="font-bold ">
                  Location
                </label>
                <select
                  className="select select-bordered outline-none focus:border-none  w-full font-semibold"
                  {...formik.getFieldProps("tableLocation")}
                >
                  <option disabled value="">
                    Location
                  </option>
                  <option value="In">Indoor</option>
                  <option value="Out">Outdoor</option>
                </select>
                {formik.touched.tableLocation &&
                  formik.submitCount > 0 &&
                  formik.errors.tableLocation && (
                    <div className="text-red-500 font-semibold">
                      {formik.errors.tableLocation}
                    </div>
                  )}
                <button
                  className="bg-black p-2 rounded-lg  text-white font-bold"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "uploading....." : "Save"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TableCreateModal;
