export const convertToUTCWithOffset = (time: string, offsetHours: number, offsetMinutes: number): Date => {
    const date = new Date();
    if (time) {
      const [hours, minutes] = time.split(":").map(Number);
      date.setUTCHours(hours - offsetHours, minutes - offsetMinutes, 0, 0);
    }
    return date;
  };
  