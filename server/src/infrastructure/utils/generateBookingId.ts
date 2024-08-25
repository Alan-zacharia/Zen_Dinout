export const generateBookingId = (prefixId = "ZENDINE") => {
    let randomPart = Math.floor(Math.random() * 10000);
    let timeStamp = Date.now();
    return `${prefixId}-${randomPart}${timeStamp}`
  };
  