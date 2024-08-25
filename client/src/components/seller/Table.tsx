import React from "react";
import TableCreateModal from "./shared/TableCreateModal";
import ConfirmationModal from "./shared/ConfrimationTableDelete";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdDelete } from "react-icons/md";
import useTableData from "../../hooks/restaurant/useTable";
import { tableSlotTypes } from "../../types/restaurantTypes";

const Table: React.FC = () => {
  const itemsPerPage = 5;
  const { id } = useSelector((state: RootState) => state.user);
  const {
    paginatedData,
    totalPage,
    currentPage,
    searchQuery,
    filterValue,
    isLoading,
    modalOpen,
    handlePageChange,
    handleUpdateTables,
    handleSearch,
    handleFilter,
    handleDeleteClick,
    handleDeleteConfirm,
    handleModalClose,
    handleAvailable,
    handleIsAvailableFilter,
  } = useTableData(id as string, itemsPerPage);
  return (
    <div className="lg:pt-14 pr-5 lg:p-10">
      <h1 className="text-xl font-bold px-5 md:hidden">Table Management</h1>
      <div className="pt-10 flex justify-between">
        <h1 className="text-xl font-bold hidden md:flex">Table Management</h1>
        <div className="flex md:gap-10 items-center">
          <div className="join px-2  md:px-0">
            <div>
              <input
                className="input input-bordered join-item focus:outline-none w-36 lg:w-[300px]"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <select
              className="select select-bordered join-item focus:outline-none w-2 md:w-full"
              onChange={handleFilter}
              value={filterValue}
            >
              <option value="">Filter</option>
              <option value="In">Indoor</option>
              <option value="Out">Outdoor</option>
            </select>
            <select
              className="select select-bordered join-item focus:outline-none w-2"
              onChange={handleIsAvailableFilter}
              value={filterValue}
            >
              <option value="">Filter</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>
          <TableCreateModal
            MountAfterUpdate={handleUpdateTables}
            tableDatas={paginatedData}
          />
        </div>
      </div>
      <div
        className={
          !isLoading
            ? "overflow-y-auto shadow-sm shadow-gray-500 mt-7"
            : "shadow-sm shadow-gray-500 mt-7"
        }
      >
        {isLoading ? (
          [1, 2, 3, 4, 5].map((val) => (
            <div className="flex w-full items-center gap-32 mx-10" key={val}>
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-20 w-24 m-5"></div>
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-20"></div>
              <div className="skeleton h-4 w-20"></div>
            </div>
          ))
        ) :  paginatedData && paginatedData.length > 0 ? (
          <table className="table">
            <thead>
              <tr className="font-bold text-sm text-black">
                <th>SL NO</th>
                <th>Table Image</th>
                <th>Table No</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Available</th>
                <th>Delete</th>
              </tr>
            </thead>
            {paginatedData.map((data: tableSlotTypes, index: number) => (
              <tbody className="text-gray-600" key={index}>
                <tr className="border-black font-bold text-base">
                  <td className="font-semibold">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
                  <td className="font-semibold">
                    <img
                      src={data.tableImage.url as string}
                      alt="table image"
                      className="w-28 h-20"
                    />
                  </td>
                  <td className="font-semibold">{data.tableNumber}</td>
                  <td className="font-semibold">{data.tableCapacity}</td>
                  <td
                    className={
                      data.tableLocation === "In"
                        ? "font-bold text-green-500"
                        : "font-bold text-blue-600"
                    }
                  >
                    {data.tableLocation === "In" ? "Indoor" : "Outdoor"}
                  </td>
                  <th>
                    <button
                      className={`w-24 h-10 rounded-md shadow-md text-white text-xs ${
                        data.isAvailable
                          ? "bg-green-400 hover:bg-green-400"
                          : "bg-red-600 hover:bg-red-500"
                      }`}
                      onClick={() =>
                        handleAvailable(data?._id, data?.isAvailable as boolean)
                      }
                    >
                      {data.isAvailable ? "Available" : "Not Available"}
                    </button>
                  </th>
                  <th>
                    <MdDelete
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteClick(data)}
                    />
                  </th>
                </tr>
              </tbody>
            ))}
          </table>
        ) : (
          <div className="text-xl font-bold flex justify-center p-10">
            NO TABLES AVAILABLE
          </div>
        )}
      </div>
      <section aria-label="Page navigation" className="flex justify-end pt-2">
        <ul className="inline-flex -space-x-px text-base h-10">
          <li>
            <button
              className="flex items-center justify-center px-4 mx-0.5 h-10 leading-tight btn-square cursor-pointer bg-black border border-e-0 text-white rounded-s-lg border-gray-700"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          {Array.from(Array(totalPage).keys()).map((page) => (
            <li key={page}>
              <button
                className={`flex items-center justify-center px-4 h-10 leading-tight border border-gray-300 ${
                  currentPage === page + 1
                    ? "bg-black text-white"
                    : "bg-gray-900 text-white"
                }`}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </button>
            </li>
          ))}
          <li>
            <button
              className="flex items-center mx-0.5 justify-center px-4 h-10 leading-tight btn-square bg-black border rounded-e-lg border-gray-700 text-white"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPage}
            >
              Next
            </button>
          </li>
        </ul>
      </section>
      <ConfirmationModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default Table;
