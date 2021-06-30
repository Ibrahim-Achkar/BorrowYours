//package imports
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, ListGroup, Button } from 'react-bootstrap';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import Meta from '../components/utility/Meta';
import {
  listBookingDetails,
  getAllBookings,
  removeBooking,
} from '../store/slices/bookingsSlice';
import '../styles/ItemScreen.css';

const BookingScreen = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(listBookingDetails(match.params.id));

    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      dispatch(removeBooking());
    };
  }, [match, dispatch]);

  const bookings = useSelector(getAllBookings);
  const { loading: bookingLoading, error: bookingError, booking } = bookings;
  const {
    reservedDates,
    isDelivered,
    isReturned,
    isCancelled,
    isComplete,
    item,
    owner,
    reserver,
  } = booking;

  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <>
      {bookingLoading ? (
        <Loader />
      ) : bookingError ? (
        <Message variant='danger'>{bookingError}</Message>
      ) : (
        <>
          <Meta title={item} />
          <Row>
            <Col className='mt-4' md={4}>
              <Row className='heading'>
                <h3>{item}</h3>
              </Row>
              <Row className='go-back'>
                <Button
                  className='btn- btn-primary my-4 p-2'
                  onClick={() => {
                    goBackHandler();
                  }}>
                  Go Back
                </Button>
              </Row>
            </Col>
            <Col className='mt-5' md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Owned by: </Col>
                    <Col>{owner}</Col>
                  </Row>
                  <Row>
                    <Col>Reserverd by: </Col>
                    <Col>{reserver}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Reserved dates: </Col>
                    <Col>{reservedDates}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Delivery status:</Col>
                    <Col>{isDelivered}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Return status: </Col>
                    <Col>{isReturned}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Cancellation status:</Col>
                    <Col>{isCancelled}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Completion status: </Col>
                    <Col>{isComplete}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className='mt-5' md={4}></Col>
          </Row>
        </>
      )}
    </>
  );
};

export default BookingScreen;
