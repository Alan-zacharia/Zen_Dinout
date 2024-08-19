import { useFormik } from "formik";
import { useState, useRef } from "react";
import { validateTableSlotTimes } from "../../../utils/validations";
import { toast, Toaster } from "react-hot-toast";
import { tablesSlotTimeCreatingApi } from "../../../services/SellerApiClient";
import { getTodayDate } from "../../../utils/dateValidateFunctions";

interface TableSlotTime {
  tableSlotTime: string;
  tableSlotDate: string;
}
const SlotAddModal = ({
  MountAfterUpdate,
  tableId,
}: {
  MountAfterUpdate: () => void;
  tableId: string | undefined;
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const inputElement = useRef<HTMLInputElement | null>(null);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const formik = useFormik<TableSlotTime>({
    initialValues: {
      tableSlotTime: "",
      tableSlotDate: "",
    },
    validationSchema: validateTableSlotTimes,
    onSubmit: async (tableAddingDatas: TableSlotTime, { resetForm }) => {
      console.log(tableAddingDatas);
      const { tableSlotDate, tableSlotTime } = tableAddingDatas;
      const [slotStartTime, slotEndTime] = tableSlotTime.split(" - ");
      const resultObject = {
        tableSlotDate: tableSlotDate,
        slotStartTime: slotStartTime,
        slotEndTime: slotEndTime,
      };
      console.log(resultObject);
      await tablesSlotTimeCreatingApi(resultObject, tableId)
        .then((res) => {
          toast.success(res.data.message);
          setShowModal(false);
          resetForm();
          MountAfterUpdate();
        })
        .catch((error: any) => {
          console.log(error.response.data.message);
        });
    },
  });
  return (
    <>
      <Toaster position="top-center" />
      <button
        onClick={toggleModal}
        className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none  focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
      >
        <span className="font-bold text-lg">+</span>New Slot
      </button>
      {showModal && (
        <div
          id="table-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 overflow-y-auto bg-gray-200 bg-opacity-45 flex justify-center items-center"
        >
          <div className="m-auto bg-white rounded-xl w-[400px] flex shadow-xl flex-col">
            <div className="p-5 flex justify-between">
              <h4 className=" font-bold text-orange-500 font-sans">Add Slot</h4>
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
            <div className="p-4 ">
              <form
                className="flex gap-3 flex-col"
                onSubmit={formik.handleSubmit}
              >
                <div className="flex flex-row gap-40">
                  <label htmlFor="Tabel_number" className="block font-bold ">
                    Time
                  </label>
                  <label htmlFor="Tabel_number" className="block font-bold">
                    Date
                  </label>
                </div>
                <div className="flex  gap-3">
                  <select
                    className="select select-bordered outline-none focus:border-none  w-full max-w-xs font-semibold"
                    {...formik.getFieldProps("tableSlotTime")}
                  >
                    <option disabled value="">
                      Time
                    </option>
                    <option value="10:00AM - 11:00AM">10:00 - 11:00</option>
                    <option value="11:00AM - 12:00PM">11:00 - 12:00</option>
                    <option value="12:00PM - 01:00PM">12:00 - 01:00</option>
                    <option value="01:00PM - 02:00PM">01:00 - 02:00</option>
                    <option value="02:00PM - 03:00PM">02:00 - 03:00</option>
                    <option value="03:00PM - 04:00PM">03:00 - 04:00</option>
                    <option value="04:00PM - 05:00PM">04:00 - 05:00</option>
                  </select>

                  <input
                    type="date"
                    ref={inputElement}
                    placeholder="Table number"
                    className="input input-bordered outline-none focus:border-none  w-full max-w-xs"
                    min={getTodayDate()}
                    {...formik.getFieldProps("tableSlotDate")}
                  />
                </div>
                <div className="flex gap-24 font-bold">
                  {formik.touched.tableSlotTime &&
                    formik.errors.tableSlotTime &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500">
                        {formik.errors.tableSlotTime}
                      </div>
                    )}
                  {formik.touched.tableSlotDate &&
                    formik.errors.tableSlotDate &&
                    formik.submitCount > 0 && (
                      <div className="text-red-500">
                        {formik.errors.tableSlotDate}
                      </div>
                    )}
                </div>
                <button
                  className="bg-orange-500 p-2 rounded-lg hover:bg-orange-600 text-white font-bold"
                  type="submit"
                >
                  Add new slot
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SlotAddModal;
