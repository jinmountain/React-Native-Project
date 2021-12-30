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

    const monthInMs = calendarDate;
    const calendarTime = useConvertTime.convertToTime(monthInMs);
    // todays date and when business end today
    const calendarDateInMs = useConvertTime.convertToDateInMs(calendarDate);
    const dateNowInMs = useConvertTime.convertToDateInMs(dateNow);

    // when end time is given
    let dateNowEndTime;
    if (endTime) {
      dateNowEndTime = dateNowInMs + endTime * 60 * 60 * 1000;
    }
    
    // days
    // 0 1 2 3 4 5 6
    // add days of the month
    let datesInPreMonth = [];
    let dayInPreMonthIndex;
    const firstDayIndex = calendarTime.dayIndex;
    if (firstDayIndex !== 0) {
      for (dayInPreMonthIndex = 1; dayInPreMonthIndex < firstDayIndex + 1; dayInPreMonthIndex++) {
        // convert
        const dayInPreMonthTime = useConvertTime.getTimeYearMonthDate(calendarTime.year, calendarTime.monthIndex, calendarTime.date - dayInPreMonthIndex);
        if (dayInPreMonthTime.timestamp > dateNowInMs) {
          datesInPreMonth.unshift({ time: dayInPreMonthTime, thisMonth: false, past: false });
        } else {
          datesInPreMonth.unshift({ time: dayInPreMonthTime, thisMonth: false, past: true });
        }
      };
    };
    
    let datesInMonth = []
    let dateInMonthIndex;
    let numOfDaysInMonth = useConvertTime.getDaysInMonth(calendarTime.monthIndex, calendarTime.year);
    for (dateInMonthIndex = 0; dateInMonthIndex < numOfDaysInMonth; dateInMonthIndex++) {
      const dateInMonthTime = useConvertTime.getTimeYearMonthDate(calendarTime.year, calendarTime.monthIndex, calendarTime.date + dateInMonthIndex);
      // date is in the month and same as today and the current time is bigger than the end time
      if (
        dateInMonthTime.timestamp === dateNowInMs && 
        dateNowEndTime && 
        dateNow > dateNowEndTime
      ) {
        datesInMonth.push({ 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: true, 
          today: true 
        });
      } 
      // date is in the month but less than today
      else if (dateInMonthTime.timestamp < dateNowInMs) {
        datesInMonth.push({ 
          time: dateInMonthTime,
          thisMonth: true, 
          past: true, 
          today: false 
        });
      }
      // date is in the month and same as today and the current time is less than the end time
      else if (
        dateInMonthTime.timestamp === dateNowInMs && 
        dateNowEndTime && 
        dateNow < dateNowEndTime
      ) {
        datesInMonth.push({ 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: false, 
          today: true 
        });
      }
      // date is in the month and bigger than today
      else {
        datesInMonth.push({ 
          time: dateInMonthTime, 
          thisMonth: true, 
          past: false, 
          today: false 
        });
      }
    };

    let datesInNextMonth = [];
    let lastDateTime = useConvertTime.getDateTimestamp(calendarTime.year, calendarTime.monthIndex, numOfDaysInMonth);
    let lastDayIndex = useConvertTime.getDayIndex(calendarTime.year, calendarTime.monthIndex, numOfDaysInMonth);

    // if lastDayIndex is not 6 which is saturday
    if (lastDayIndex !== 6) {
      let daysLeftInWeek = 6 - lastDayIndex;
      let dayInNextMonthIndex
      for (dayInNextMonthIndex = 1; dayInNextMonthIndex < daysLeftInWeek + 1; dayInNextMonthIndex++) {
        const dateInNextMonthTime = useConvertTime.getTimeYearMonthDate(calendarTime.year, calendarTime.monthIndex, numOfDaysInMonth + dayInNextMonthIndex);
        datesInNextMonth.push({ time: dateInNextMonthTime, thisMonth: false, past: false });
      };
    }

    const datesOnFullCalendarPage = datesInPreMonth.concat(datesInMonth, datesInNextMonth);
    // turn the long line of dates into shelf like a structure
    // let datesOnShelf = [];

    // const datesLen = datesOnFullCalendarPage.length;
    // const numOfRows = Math.ceil(datesLen / 7);

    // let rowIndex = 0;

    // for (rowIndex; rowIndex < numOfRows; rowIndex++) {
    //   const adjustedIndex = rowIndex * 7
    //   console.log("slice index: ", adjustedIndex, adjustedIndex + 7)
    //   const datesOnRow = datesOnFullCalendarPage.slice(adjustedIndex, adjustedIndex + 7);
    //   datesOnShelf.push(datesOnRow);
    // }

    mounted && setDatesOnCalendar(datesOnFullCalendarPage);

    return () => {
      mounted = false;
      setDatesOnCalendar([]);
    }
  }, [calendarDate]);
}