export  const getBookingStatusColor = (status: string): string => {
    switch (status) {
      case "CONFIRMED":
        return "text-green-500";
      case "CANCELLED":
        return "text-red-500";
      case "PENDING":
        return "text-yellow-500";
      case "CHECKED":
        return "text-blue-500";
      default:
        return "text-gray-500";
    }
  };