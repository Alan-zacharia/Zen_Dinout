export const getFormattedDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const istOffset = 5.5 * 60;
    const localDate = new Date(dateObj.getTime() + istOffset * 60 * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return localDate.toLocaleDateString('en-IN', options);
  };
  