import React, { useState, useEffect } from "react";
import NoTables from "../../assets/NoTablesAvailable.jpg";
import axiosInstance from "../../api/axios";
import { tableSlotTypes } from "../../types/restaurantTypes";
import ImageModal from "./shared/TableImageView";
import ConfirmationModal from "./shared/TableConfirmationModal"; // Import the ConfirmationModal component

interface SelectTableProps {
  restaurantId: string;
  tableSize: number;
  selectedDate: string;
  selectedTime: string;
  restaurantName: string;
  tableRatePerPerson: string;
  slotId: string;
}

const SelectTableList: React.FC<SelectTableProps> = ({
  restaurantId,
  tableSize,
  selectedDate,
  selectedTime,
  restaurantName,
  tableRatePerPerson,
  slotId,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tablesPerPage, setTablePerPage] = useState<number>(4);
  const [tables, setTables] = useState<tableSlotTypes[]>([]);
  const [totalTables, setTotalTables] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] =
    useState<boolean>(false);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [selectedTable, setSelectedTable] = useState<{
    tableNumber: string;
    geustCount: number;
    tableImage: string;
    restaurantId: string;
    selectedDate: string;
    selectedTime: string;
    restaurantName: string;
    tableRatePerPerson: string;
    tableId: string;
    timeSlotId: string;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/restaurant/${restaurantId}/tables?size=${tableSize}&slot=${slotId}&date=${selectedDate}&page=${currentPage}`
        );
        setTables(res.data.availableTables);
        setTablePerPage(res.data.tablesPerPage);
        setTotalTables(res.data.totalTables);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [currentPage, restaurantId, tableSize, slotId, selectedDate]);
  const totalPage = Math.ceil(totalTables / tablesPerPage);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImageClick = (imageSrc: string) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage("");
  };

  const handleReserveTable = (table: {
    tableNumber: string;
    geustCount: number;
    tableImage: string;
    restaurantId: string;
    selectedDate: string;
    selectedTime: string;
    restaurantName: string;
    tableRatePerPerson: string;
    tableId: string;
    timeSlotId: string;
  }) => {
    setSelectedTable(table);
    setIsConfirmationModalOpen(true);
  };

  const handleConfirmReservation = () => {
    if (selectedTable) {
      setIsConfirmationModalOpen(false);
    }
  };

  return (
    <section className="py-10 lg:px-[100px]">
      <h1 className="px-10 lg:px-0 text-xl xl:text-2xl font-bold text-black mb-6">
        Available Tables
      </h1>

      <div className="container mx-auto">
        {!tables || tables.length < 1 ? (
          <div className="flex flex-col items-center gap-7">
            <img
              src={NoTables}
              alt="No Tables Available"
              className="h-[300px] w-[300px] sm:h-[400px] sm:w-[400px] lg:h-[500px] lg:w-[500px]"
            />
            <p className="text-lg sm:text-xl font-bold text-gray-700 text-center">
              Sorry, No tables are currently available...
            </p>
            <div className="w-full text-center">
              <p className="text-sm sm:text-md text-gray-600">
                All our tables are occupied at the moment. Please check back
                later or try reserving for a different time. Thank you for your
                understanding!
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap lg:justify-start justify-center gap-7">
            {tables.map((table) => (
              <div
                key={table._id}
                className="w-[290px] flex flex-col rounded overflow-hidden shadow-lg bg-white cursor-pointer"
              >
                <div className="relative">
                  {!isImageLoaded && (
                     <div className="flex justify-center items-center h-32 w-full">
                     <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
                       <span className="sr-only">Loading...</span>
                     </div>
                   </div>
                  )}
                  <img
                    className={`object-cover h-32 w-full ${
                      isImageLoaded ? "block" : "hidden"
                    }`}
                    src={table.tableImage.url as string}
                    alt="Table"
                    onLoad={() => setIsImageLoaded(true)}
                    onClick={() =>
                      handleImageClick(table.tableImage.url as string)
                    }
                  />
                </div>
                <div className="px-3 py-3 flex-grow">
                  <div className="font-bold text-lg mb-2">
                    {table.tableNumber}
                  </div>
                  <p className="text-gray-700 text-sm">
                    Seats : {table.tableCapacity}
                  </p>
                  <p className="text-gray-700 text-sm">
                    Description: This is a cozy table near the window.
                  </p>
                  <div className="mt-4">
                    <button
                      className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-2 rounded"
                      onClick={() =>
                        handleReserveTable({
                          tableNumber: table.tableNumber,
                          geustCount: tableSize,
                          tableImage: table.tableImage.url as string,
                          restaurantId: restaurantId,
                          selectedDate: selectedDate,
                          selectedTime: selectedTime,
                          restaurantName,
                          tableRatePerPerson,
                          tableId: table._id as string,
                          timeSlotId: slotId,
                        })
                      }
                    >
                      Reserve Table
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end px-72 pt-6">
          <div className="join">
            {Array.from({ length: totalPage }, (_, i) => (
              <input
                key={i}
                className={`join-item btn btn-square ${
                  currentPage === i + 1 ? "btn-active btn-primary" : ""
                }`}
                type="button"
                value={i + 1}
                onClick={() => handlePageChange(i + 1)}
              />
            ))}
          </div>
        </div>
      </div>
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        imageSrc={selectedImage}
      />
      {selectedTable && (
        <ConfirmationModal
          isOpen={isConfirmationModalOpen}
          onClose={() => setIsConfirmationModalOpen(false)}
          tableDetails={selectedTable}
          onConfirm={handleConfirmReservation}
        />
      )}
    </section>
  );
};

export default SelectTableList;
