import React, { ChangeEvent, useState } from "react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const Form: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [itemImages, setItemImages] = useState<File[]>([]);
  const [error, setError] = useState<string>("");

  const toggleModal = () => {
    setShowModal(!showModal);
    setItemImages([]);
    setError("");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      files.forEach((file) => {
        if (file.size > 1024 * 1024) {
          invalidFiles.push(file.name);
        } else if (file.type.startsWith("image/")) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      if (invalidFiles.length > 0) {
        setError(
          `Invalid files: ${invalidFiles.join(
            ", "
          )} (must be images under 1 MB).`
        );
      } else {
        setItemImages([...itemImages, ...validFiles]);
        setError("");
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setItemImages(itemImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (itemImages.length === 0) {
      setError("Please select at least one image.");
      return;
    }
    const formData = new FormData();
    itemImages.forEach((file) => formData.append("images", file));
    try {
      const response = await axiosInstance.post("/restaurant/menu", formData);
      toast.success(response.data?.message ?? "uploaded successffully....");
      toggleModal();
      window.location.reload(); 
    } catch (error) {
      setError("Failed to upload. Please try again.");
    }
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
              <div className="grid gap-4 mb-4 grid-cols-1">
                <div className="col-span-1">
                  <label
                    htmlFor="itemImages"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Item images
                  </label>
                  <input
                    name="itemImages"
                    id="itemImages"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="input input-bordered input-warning w-full max-w-xs"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-1">{error}</p>
                  )}
                </div>

                {itemImages.length > 0 && (
                  <div className="col-span-1">
                    <h4 className="text-md font-medium text-gray-900 mb-2">
                      Selected Images:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {itemImages.map((file, index) => (
                        <div key={index} className="relative w-24 h-24">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Selected ${index}`}
                            className="w-full h-full object-cover rounded"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                            aria-label="Remove image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
