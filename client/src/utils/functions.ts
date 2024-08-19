export const getTimePeriod = (timeString: string): string => {
  const [time, modifier] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  if (modifier === "PM" && hours !== "12") {
    hours = (parseInt(hours, 10) + 12).toString();
  }

  if (modifier === "AM" && hours === "12") {
    hours = "0";
  }

  const totalMinutes = parseInt(hours, 10) * 60 + parseInt(minutes, 10);

  if (totalMinutes >= 360 && totalMinutes < 720) {
    return "morning";
  } else if (totalMinutes >= 720 && totalMinutes < 1080) {
    return "afternoon";
  } else if (totalMinutes >= 1080 && totalMinutes < 1440) {
    return "evening";
  }

  return "unknown";
};

export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
};
