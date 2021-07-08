//package imports
import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Button } from 'react-bootstrap';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import Meta from '../components/utility/Meta';
import BookingCalendar from '../components/data/BookingCalendar';
import {
  listItemDetails,
  getAllItems,
  removeItem,
} from '../store/slices/itemsSlice';
import '../styles/ItemScreen.css';
import { getAllBookings } from '../store/slices/bookingsSlice';

const ItemScreen = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(listItemDetails(match.params.id));

    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      dispatch(removeItem());
    };
  }, [match, dispatch]);

  //getting the current item
  const items = useSelector(getAllItems);
  const { loading: itemLoading, error: itemError, item } = items;
  const {
    countInStock,
    name,
    imageURL,
    description,
    brand,
    category,
    user,
    userId: ownerUserId,
    _id: itemId,
    bookedDates,
  } = item;

  //getting the current booking, if any
  const bookings = useSelector(getAllBookings);
  const { booking } = bookings;

  const userAuth = useSelector((state) => state.features.userAuth);
  const { userLogin } = userAuth;
  const { _id: reserverUserId, token: reserveUserToken } = userLogin;

  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <>
      {itemLoading ? (
        <Loader />
      ) : itemError ? (
        <Message variant='danger'>{itemError}</Message>
      ) : (
        <>
          <Meta title={name} />
          <Row>
            <Col className='mt-4' md={4}>
              <Row className='heading'>
                <h3>{name}</h3>
              </Row>
              <Row className='image'>
                <Image src={imageURL} alt={name} fluid />
              </Row>
              <Row className='go-back'>
                <Col className='mr-0 ml-0 pl-0'>
                  <Button
                    className='btn- btn-primary my-4'
                    onClick={() => {
                      goBackHandler();
                    }}>
                    Go Back
                  </Button>
                </Col>
                {reserverUserId !== ownerUserId ? null : (
                  <Col className='mr-0 ml-0 pl-0'>
                    <Button
                      className='btn- btn-primary my-4'
                      onClick={() => {
                        history.push(`/items/${item._id}/edit`);
                      }}>
                      Edit
                    </Button>
                  </Col>
                )}
              </Row>
            </Col>
            <Col className='mt-5' md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Owned by: </Col>
                    {reserverUserId === ownerUserId ? (
                      <Col>You!</Col>
                    ) : (
                      <Col>{user}</Col>
                    )}
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Category: </Col>
                    <Col>{category}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Brand:</Col>
                    <Col>{brand}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Description: </Col>
                    <Col>{description}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col className='mt-5' md={4}>
              <ListGroup variant='flush'>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      <strong>
                        {countInStock > 0 ? 'Available' : 'Not Available'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {reserverUserId === ownerUserId ? null : (
                  <ListGroup.Item>
                    <BookingCalendar
                      ownerUserId={ownerUserId}
                      itemId={itemId}
                      reserverUserId={reserverUserId}
                      reserveUserToken={reserveUserToken}
                      bookedDates={bookedDates}
                      history={history}
                      booking={booking}
                    />
                  </ListGroup.Item>
                )}{' '}
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ItemScreen;
