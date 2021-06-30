//package imports
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import { createBooking } from '../../store/slices/bookingsSlice';

const BookingCalendar = ({
  ownerUserId,
  itemId,
  reserverUserId,
  reserveUserToken,
  bookedDates,
  history,
  booking,
}) => {
  const dispatch = useDispatch();
  const [calValue, changeCalValue] = useState(new Date());
  const reservedDates = []; //this value will be filled with whatever date period the user selects

  //redirecting to a booking once booking is created (booking in state will be empty before booking creation)
  useEffect(() => {
    if (booking._id) {
      history.push(`/bookings/${booking._id}`);
    }
  });

  //putting the booked out dates back into object format so that the calendar can read them
  const bookedDatesToISO = [];
  if (bookedDates) {
    bookedDates.forEach((date) => bookedDatesToISO.push(new Date(date)));
  }

  //helper function: check if the passed in days are the same day
  function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
  }

  //calendar function: disable tiles if they in a list of reserved dates
  function tileDisabled({ date, view }) {
    // Disable tiles in month view only
    if (view === 'month') {
      // Check if a date React-Calendar wants to display is on the list of disabled dates
      return bookedDatesToISO.find((dDate) => isSameDay(dDate, date));
    }
  }

  //creating the data to send in the createBooking dispatch
  const data = {
    item: itemId,
    owner: ownerUserId,
    reserver: reserverUserId,
    reservedDates,
  };

  //Submission of headers and data through updateUserProfile
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${reserveUserToken}`,
  };

  //booking creation
  async function submitHandler(reserveData) {
    if (!reserveData) {
      return;
    }

    if (reserveData && reserveData.length === 2) {
      let start = reserveData[0];
      let end = reserveData[1];

      for (let date of bookedDatesToISO) {
        if (isWithinInterval(date, { start, end })) {
          return alert`Please select a range without a reserved date`;
        }
      }

      let allDays = eachDayOfInterval({
        start,
        end,
      });

      allDays.forEach((date) => {
        reservedDates.push(date.toString());
      });
    } else {
      /*because the current date on page load will be the date to the current second, 
      a straight compare of today's date to the reserveData date will return false even if the days match
      slicing to index 15 will allow comparison of dates and not time
      this is not an issue when comparing within a range because isWithinInterval handles it*/
      for (let date of bookedDatesToISO) {
        if (
          date.toString().slice(0, 15) === reserveData.toString().slice(0, 15)
        ) {
          return alert`Sorry, this item is reserved for today!`;
        }
      }

      reservedDates.push(reserveData.toString());
    }
    try {
      dispatch(createBooking(data, headers));
    } catch (error) {
      return alert`${error}`;
    }
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
            submitHandler(calValue);
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
