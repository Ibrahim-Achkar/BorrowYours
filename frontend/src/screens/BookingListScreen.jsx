//package imports
import React from 'react';
import { Container, Row } from 'react-bootstrap';

//app imports
import BookingsTable from '../components/data/BookingsTable';
// import SearchBox from '../components/data/SearchBox';

const BookingListScreen = ({ history, match }) => {
  return (
    <>
      <Container>
        <Row className='mt-4 mb-4 ml-0 mr-0'>
          {/* <SearchBox history={history} list={'bookings'} /> */}
        </Row>
        <BookingsTable history={history} match={match} />
      </Container>
    </>
  );
};

export default BookingListScreen;
