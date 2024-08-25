import React from "react";
import { Link } from "react-router-dom";
import { getStatusClassName } from "../../utils/dateValidateFunctions";
import { useReservation } from "../../hooks/restaurant/useReservation";
import { format } from "date-fns";

const Reservation: React.FC = () => {
  const {
    paginatedData,
    handlePageChange,
    searchQuery,
    currentPage,
    totalPage,
    handleSearch,
    statusFilter,
    handleStatusFilterChange,
    timeFilter,
    handleTimeFilterChange,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    setStartDate,
    setEndDate,
  } = useReservation();

  const handleClearDates = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="lg:pt-20 pr-5 lg:p-10">
      <div className="flex justify-between">
        <h1 className="text-xl font-bold">Reservation Management</h1>
      </div>

      <div className="overflow-x-auto shadow-black pt-5">
        <div className="flex flex-wrap justify-end gap-5 items-center">
          <div className="join px-2 md:px-5 pb-2 flex flex-wrap gap-2">
            <input
              className="input input-bordered join-item focus:outline-none w-36 lg:w-[300px]"
              placeholder="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            <select
              className="select select-bordered join-item focus:outline-none w-36 md:w-32"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="">All Status</option>
              <option value="confirmed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Canceled</option>
            </select>
            <select
              className="select select-bordered join-item focus:outline-none w-36 md:w-32"
              value={timeFilter}
              onChange={handleTimeFilterChange}
            >
              <option value="">All Times</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <div className="flex items-center gap-2  pb-3 flex-wrap">
            <div className="flex-1">
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={handleStartDateChange}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <span className="text-gray-700">to</span>
            <div className="flex-1">
              <input
                type="date"
                id="end-date"
                value={endDate}
                onChange={handleEndDateChange}
                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            {startDate && (
              <button
                className="py-2 rounded-lg px-3 bg-red-500 text-white font-bold"
                onClick={handleClearDates}
              >
                reset
              </button>
            )}
          </div>
        </div>

        {paginatedData && paginatedData.length > 0 ? (
          <table className="table border-2">
            <thead>
              <tr className="text-base text-black font-bold border-b border-b-gray-300">
                <th>Booking Id</th>
                <th>Name</th>
                <th>Time</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData && paginatedData.map((bookingDetails) => (
                <tr
                  className="border-b border-b-gray-300 h-20 text-gray-700 font-bold text-base"
                  key={bookingDetails._id}
                >
                  <td>
                    <p>
                      {bookingDetails && bookingDetails.bookingId && bookingDetails.bookingId.length > 15
                        ? bookingDetails.bookingId.substring(0, 14)
                        : bookingDetails.bookingId}
                      ...
                    </p>
                  </td>
                  <td>{bookingDetails.userId.username}</td>
                  <td>{bookingDetails.bookingTime}</td>
                  <td>
                    {format(new Date(bookingDetails.bookingDate), "dd-MM-yyyy")}
                  </td>
                  <td>{bookingDetails.guestCount}</td>
                  <td>
                    <p
                      className={`btn text-white font-bold btn-sm ${getStatusClassName(
                        bookingDetails.bookingStatus
                      )}`}
                    >
                      {bookingDetails.bookingStatus.toLowerCase()}
                    </p>
                  </td>
                  <td>
                    <Link
                      to={`/restaurant/reservations/view/${bookingDetails.bookingId}`}
                    >
                      <button className="btn btn-neutral text-white btn-xs">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-xl font-bold flex justify-center p-10 border shadow-md">
            NO RESERVATIONS AVAILABLE
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
    </div>
  );
};

export default Reservation;
