import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const DateUtils = {
  formatDate: (isoDateString: string): string => {
    try {
      const date = new Date(isoDateString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date string');
      }

      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      throw new Error(
        `Failed to format date: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  },
  formatDateTime: (isoString: string, timeZone = 'Asia/Dhaka'): string => {
    return dayjs(isoString)
      .tz(timeZone)
      .format('MMMM D, YYYY [at] hh:mm A (z)');
  },
};

export default DateUtils;
