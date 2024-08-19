import { useState, useEffect, useMemo, useCallback } from "react";
import { getTablesSlots } from "../../services/SellerApiClient";
import { tableSlotTypes } from "../../types/restaurantTypes";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const useTableData = (userId: string, itemsPerPage: number) => {
  const [allTableData, setAllTableData] = useState<tableSlotTypes[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterIsAvailable, setIsAvailableFilter] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [tableToDelete, setTableToDelete] = useState<tableSlotTypes | null>(
    null
  );

  const fetchTableData = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await getTablesSlots(userId, page);
      setAllTableData(res.data.tables);
      setTotalPage(Math.ceil(res.data.tables.length / itemsPerPage));
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData(currentPage);
  }, [userId]);

  const filteredData = useMemo(() => {
    return allTableData.filter((data) => {
      const matchesSearchQuery = data.tableNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesFilter =
        filterValue === "" || data.tableLocation === filterValue;
      const matchedIsAvailable =
        filterIsAvailable === "" ||
        (filterIsAvailable === "true" && data.isAvailable) ||
        (filterIsAvailable === "false" && !data.isAvailable);
      return matchesSearchQuery && matchesFilter && matchedIsAvailable;
    });
  }, [allTableData, searchQuery, filterValue, filterIsAvailable]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    setTotalPage(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length, itemsPerPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPage) {
        setCurrentPage(page);
      }
    },
    [totalPage]
  );

  const handleUpdateTables = useCallback((newTableSlot: tableSlotTypes) => {
    setAllTableData((prevTables) => [newTableSlot, ...prevTables]);
  }, []);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleFilter = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setFilterValue(event.target.value);
      setCurrentPage(1);
    },
    []
  );
  const handleIsAvailableFilter = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setIsAvailableFilter(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleDeleteClick = useCallback((table: tableSlotTypes) => {
    setTableToDelete(table);
    setModalOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      if (tableToDelete) {
        const res = await axiosInstance.delete(
          `/restaurant/delete-table/${tableToDelete._id}`
        );
        setAllTableData((prevTables) =>
          prevTables.filter((table) => table._id !== tableToDelete._id)
        );
        toast.success(res.data.message);
        setModalOpen(false);
        setTableToDelete(null);
      }
    } catch (error) {
      toast.error("Something went wrong, try again later!");
    }
  }, [tableToDelete]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setTableToDelete(null);
  }, []);

  const handleAvailable = useCallback(
    async (tableId: string | undefined, isAvailable: boolean) => {
      try {
         await axiosInstance.patch(
          `/restaurant/table-available/${tableId}`,
          { isAvailable: !isAvailable }
        );
        setAllTableData((prevData) =>
          prevData.map((table) =>
            table._id == tableId
              ? { ...table, isAvailable: !isAvailable }
              : table
          )
        );
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong try again later....");
      }
    },
    []
  );
  return {
    allTableData,
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
  };
};

export default useTableData;
