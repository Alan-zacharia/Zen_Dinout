// import { useCallback, useEffect, useMemo, useState } from "react";
// import axiosInstance from "../../api/axios";
// import { getTimePeriod } from "../../utils/functions";

// interface Booking {
//   _id: string;
//   bookingId: string;
//   userId: {
//     _id: string;
//     username: string;
//     email: string;
//   };
//   tableSlotId: string;
//   restaurantId: {
//     _id: string;
//     restaurantName: string;
//   };
//   bookingTime: string;
//   paymentMethod: string;
//   paymentStatus: string;
//   bookingStatus: string;
//   totalAmount: number;
//   bookingDate: string;
//   guestCount: number;
//   createdAt: string;
//   updatedAt: string;
// }

// export const useReservation = () => {
//   const itemsPerPage = 5;
//   const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
//   const [totalPage, setTotalPage] = useState<number>(1);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [timeFilter, setTimeFilter] = useState("");

//   useEffect(() => {
//     const fetchReservations = () => {
//       axiosInstance
//         .get("/restaurant/reservations/")
//         .then((res) => {
//           setBookingDetails(res.data.Reservations);
//           setTotalPage(Math.ceil(res.data.Reservations.length / itemsPerPage));
//         })
//         .catch(({ response }) => {
//           console.log(response);
//         });
//     };
//     fetchReservations();
//   }, []);

//   const handlePageChange = useCallback(
//     (page: number) => {
//       if (page >= 1 && page <= totalPage) {
//         setCurrentPage(page);
//       }
//     },
//     [totalPage]
//   );

//   const handleSearch = useCallback(
//     (event: React.ChangeEvent<HTMLInputElement>) => {
//       setSearchQuery(event.target.value);
//       setCurrentPage(1);
//     },
//     []
//   );

//   const handleStatusFilterChange = useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       setStatusFilter(event.target.value);
//       setCurrentPage(1);
//     },
//     []
//   );

//   const handleTimeFilterChange = useCallback(
//     (event: React.ChangeEvent<HTMLSelectElement>) => {
//       setTimeFilter(event.target.value);
//       setCurrentPage(1);
//     },
//     []
//   );

//   const filteredData = useMemo(() => {
//     return bookingDetails.filter((data) => {
//       const matchesSearchQuery = data.userId.username
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase()) || data.bookingId.toLowerCase()
//         .includes(searchQuery.toLowerCase())
//       const matchesStatusFilter =
//         statusFilter === "" ||
//         data.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
//       const matchesTimeFilter =
//         timeFilter === "" || getTimePeriod(data.bookingTime) === timeFilter;
//       return matchesSearchQuery && matchesStatusFilter && matchesTimeFilter;
//     });
//   }, [bookingDetails, searchQuery, statusFilter, timeFilter]);

//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredData, currentPage, itemsPerPage]);

//   useEffect(() => {
//     setTotalPage(Math.ceil(filteredData.length / itemsPerPage));
//   }, [filteredData.length, itemsPerPage]);

//   return {
//     handlePageChange,
//     currentPage,
//     totalPage,
//     searchQuery,
//     handleSearch,
//     statusFilter,
//     handleStatusFilterChange,
//     timeFilter,
//     handleTimeFilterChange,
//     paginatedData,
//   };
// };

import { useCallback, useEffect, useMemo, useState } from "react";
import axiosInstance from "../../api/axios";
import { getTimePeriod } from "../../utils/functions";

interface Booking {
  _id: string;
  bookingId: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  tableSlotId: string;
  restaurantId: {
    _id: string;
    restaurantName: string;
  };
  bookingTime: string;
  paymentMethod: string;
  paymentStatus: string;
  bookingStatus: string;
  totalAmount: number;
  bookingDate: string;
  guestCount: number;
  createdAt: string;
  updatedAt: string;
}

export const useReservation = () => {
  const itemsPerPage = 5;
  const [bookingDetails, setBookingDetails] = useState<Booking[]>([]);
  const [totalPage, setTotalPage] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    const fetchReservations = () => {
      axiosInstance
        .get("/restaurant/reservations/")
        .then((res) => {
          setBookingDetails(res.data.Reservations);
          setTotalPage(Math.ceil(res.data.Reservations.length / itemsPerPage));
        })
        .catch(({ response }) => {
          console.log(response);
        });
    };
    fetchReservations();
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPage) {
        setCurrentPage(page);
      }
    },
    [totalPage]
  );

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleStatusFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setStatusFilter(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleTimeFilterChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setTimeFilter(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleStartDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setStartDate(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const handleEndDateChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setEndDate(event.target.value);
      setCurrentPage(1);
    },
    []
  );

  const filteredData = useMemo(() => {
    return bookingDetails.filter((data) => {
      const matchesSearchQuery =
        data.userId.username
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        data.bookingId.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatusFilter =
        statusFilter === "" ||
        data.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
      const matchesTimeFilter =
        timeFilter === "" || getTimePeriod(data.bookingTime) === timeFilter;

      const bookingDate = new Date(data.bookingDate);
      const isAfterStartDate = !startDate || bookingDate >= new Date(startDate);
      const isBeforeEndDate = !endDate || bookingDate <= new Date(endDate);
      const matchesDateFilter = isAfterStartDate && isBeforeEndDate;
      return (
        matchesSearchQuery &&
        matchesStatusFilter &&
        matchesTimeFilter &&
        matchesDateFilter
      );
    });
  }, [
    bookingDetails,
    searchQuery,
    statusFilter,
    timeFilter,
    startDate,
    endDate,
  ]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  useEffect(() => {
    setTotalPage(Math.ceil(filteredData.length / itemsPerPage));
  }, [filteredData.length, itemsPerPage]);

  return {
    handlePageChange,
    currentPage,
    totalPage,
    searchQuery,
    handleSearch,
    statusFilter,
    handleStatusFilterChange,
    timeFilter,
    handleTimeFilterChange,
    startDate,
    handleStartDateChange,
    endDate,
    handleEndDateChange,
    paginatedData,
    setStartDate,
    setEndDate
  };
};
