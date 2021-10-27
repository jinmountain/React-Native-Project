import { useEffect } from 'react';

// hooks
import useConvertTime from './useConvertTime';

export const getCalendarDates = (
  calendarDate, 
  dateNow, 
  endTime, 
  setDatesOnCalendar
) => {
  // Calculate 
  // - Calander Dates 
  // - Dates Left In The Month  
  // - Dates of The Following Month in The Last Week of The Month
  useEffect(() => {
    let mounted = true;
    const monthInMs = useConvertTime.convertToMonthInMs(calendarDate);
    const time = useConvertTime.convertToTime(monthInMs);
    const monthIndex = time.monthIndex;
    // todays date and when business end today
    const calendarDateInMs = useConvertTime.convertToDateInMs(calendarDate);
    const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);
    const dateNowEndTime = dateNowInMs + endTime * 60 * 60 * 1000;

    // days
    // 0 1 2 3 4 5 6
    // add days of the month
    let datesInPreMonth = [];
    let dayInPreMonthIndex;
    const firstDayIndex = time.dayIndex;
    if (firstDayIndex !== 0) {
      for (dayInPreMonthIndex = 1; dayInPreMonthIndex < firstDayIndex + 1; dayInPreMonthIndex++) {
        const dayInPreMonthTimestamp = useConvertTime.convertToDateInMs(monthInMs - dayInPreMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000);
        const dayInPreMonthTime = useConvertTime.convertToTime(dayInPreMonthTimestamp);
        if (dayInPreMonthTimestamp > dateNowInMs) {
          datesInPreMonth.unshift({ dateInMS: dayInPreMonthTimestamp, time: dayInPreMonthTime, thisMonth: false, past: false });
        } else {
          datesInPreMonth.unshift({ dateInMS: dayInPreMonthTimestamp, time: dayInPreMonthTime, thisMonth: false, past: true });
        }
      };
    }
    
    let datesInMonth = []
    let dateInMonthIndex;
    let numOfDaysInMonth = useConvertTime.getDaysInMonth(monthIndex, time.year);
    for (dateInMonthIndex = 0; dateInMonthIndex < numOfDaysInMonth; dateInMonthIndex++) {
      const dateInMonthTimestamp = useConvertTime.convertToDateInMs(monthInMs + dateInMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000) // to avoid day light savings;
      const dateInMonthTime = useConvertTime.convertToTime(dateInMonthTimestamp);
      // date is in the month and same as today and the current time is bigger than the end time
      if (dateInMonthTimestamp === dateNowInMs && dateNow > dateNowEndTime) {
        datesInMonth.push({ 
          dateInMS: dateInMonthTimestamp, 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: true, 
          today: true 
        });
      } 
      // date is in the month but less than today
      else if (dateInMonthTimestamp < dateNowInMs) {
        datesInMonth.push({ 
          dateInMS: dateInMonthTimestamp, 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: true, 
          today: false 
        });
      }
      // date is in the month and same as today and the current time is less than the end time
      else if (dateInMonthTimestamp === dateNowInMs && dateNow < dateNowEndTime) {
        datesInMonth.push({ 
          dateInMS: dateInMonthTimestamp, 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: false, 
          today: true 
        });
      }
      // date is in the month and bigger than today
      else {
        datesInMonth.push({ 
          dateInMS: dateInMonthTimestamp, 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: false, 
          today: false 
        });
      }
    };

    let datesInNextMonth = [];
    let lastDateTimestamp = useConvertTime.getDateTimestamp(time.year, monthIndex, numOfDaysInMonth);
    let lastDayIndex = useConvertTime.getDayIndex(time.year, monthIndex, numOfDaysInMonth);
    
    // if lastDayIndex is not 6 which is saturday
    if (lastDayIndex !== 6) {
      let daysLeftInWeek = 6 - lastDayIndex;
      let dayInNextMonthIndex
      for (dayInNextMonthIndex = 1; dayInNextMonthIndex < daysLeftInWeek + 1; dayInNextMonthIndex++) {
        const dateInNextMonthTimestamp = useConvertTime.convertToDateInMs(lastDateTimestamp + dayInNextMonthIndex * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000);
        const dateInNextMonthTime = useConvertTime.convertToTime(dateInNextMonthTimestamp);
        datesInNextMonth.push({ dateInMS: dateInNextMonthTimestamp, time: dateInNextMonthTime, thisMonth: false, past: false });
      };
    }

    mounted && setDatesOnCalendar(datesInPreMonth.concat(datesInMonth, datesInNextMonth));

    return () => {
      mounted = false;
      setDatesOnCalendar([]);
    }
  }, [calendarDate]);
}