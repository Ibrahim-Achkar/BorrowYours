//package imports
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import {
  differenceInCalendarDays,
  eachDayOfInterval,
  isWithinInterval,
} from 'date-fns';
import { Button } from 'react-bootstrap';

//app imports
import 'react-calendar/dist/Calendar.css';
import '../../styles/BookingCalendar.css';

const BookingCalendar = () => {
  const [calValue, changeCalValue] = useState(new Date());
  const resPeriod = [];

  const reservedDates = [
    new Date(
      `Fri Jun 18 2021 00:00:00 GMT+1000 (Australian Eastern Standard Time)`
    ),
    new Date(
      `Sun Jun 20 2021 00:00:00 GMT+1000 (Australian Eastern Standard Time)`
    ),
    new Date(
      `Thu Jun 24 2021 00:00:00 GMT+1000 (Australian Eastern Standard Time)`
    ),
  ];

  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
  }

  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to check is on the list of disabled dates
      return reservedDates.find((dDate) => isSameDay(dDate, date));
    }
  }

  function reserveItem(reserveData) {
    if (!reserveData) {
      return;
    }

    if (reserveData && reserveData.length === 2) {
      let start = reserveData[0];
      let end = reserveData[1];

      for (let date of reservedDates) {
        if (isWithinInterval(date, { start, end })) {
          return alert`Please select a range without a reserved date`;
        }
      }

      let allDays = eachDayOfInterval({
        start,
        end,
      });

      allDays.forEach((date) => {
        resPeriod.push(date);
      });
    } else {
      resPeriod.push(reserveData);
    }

    console.log(`resPeriod`, resPeriod);
  }

  return (
    <>
      <div>
        <Calendar
          onChange={changeCalValue}
          value={calValue}
          tileDisabled={tileDisabled}
          selectRange
          allowPartialRange
        />
      </div>
      <div className='mt-4'>
        <Button
          onClick={() => {
            reserveItem(calValue);
          }}
          className='btn-block'
          type='button'
          // disabled={}
        >
          Borrow It!
        </Button>
      </div>
    </>
  );
};

export default BookingCalendar;
