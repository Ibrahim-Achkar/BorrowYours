//package imports
import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

//app imports
import Message from '../utility/Message';
import Loader from '../utility/Loader';
import Paginate from '../utility/Paginate';
import Meta from '../utility/Meta';
import { loadBookings, getAllBookings } from '../../store/slices/bookingsSlice';
import '../../styles/ItemListScreen.css';

const ItemTable = ({ history, match, name }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const items = useSelector(getAllBookings);
  const { error, list, loading, page, pages } = items;

  const tableName = name || 'Bookings';

  // testing to see if we are in a user profile
  //TODO this is very ugly code should be refactored
  const location = useLocation();
  const regex = /profile/g;
  const userAuth = useSelector((state) => state.features.userAuth.userLogin);
  const { name: userName } = userAuth;
  let filteredList = null;
  let reactList = null;

  if (regex.test(location.pathname)) {
    filteredList = list.filter((item) => {
      return item.user.name === userName;
    });
  }

  if (filteredList) {
    reactList = filteredList;
  } else {
    reactList = list;
  }

  //implementing search
  const keyword = match.params.keyword;

  //dispatching loaditems with the keyword and correct page number
  useEffect(() => {
    dispatch(loadBookings(keyword, pageNumber));
  }, [dispatch, keyword, pageNumber, userName]);

  return (
    <>
      <Meta title={Meta.defaultProps.title} />
      <Row className='align-items-center'>
        <Col>
          <h1>{tableName}</h1>
        </Col>
        <Col className='text-right'>
          <LinkContainer to={`/create_item`}>
            <Button className='my-3'>
              <i className='fas fa-plus'></i> Create Item
            </Button>
          </LinkContainer>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ITEM</th>
                <th>OWNER</th>
                <th>RESERVER</th>
                <th>DATES RESERVED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reactList.map((booking) => (
                <LinkContainer
                  key={('link to', booking._id)}
                  to={`/bookings/${booking._id}`}>
                  <tr key={booking._id}>
                    <td>{booking.item.name}</td>
                    <td>{booking.owner.name}</td>
                    <td>{booking.reserver.name}</td>
                    <td>
                      <ul>
                        {booking.reservedDates.map((date) => (
                          <li key={date}>{date}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <LinkContainer to={`/bookings/${booking._id}`}>
                        <Button variant='light' className='btn-sm'>
                          <p>View Booking</p>
                        </Button>
                      </LinkContainer>
                    </td>
                  </tr>
                </LinkContainer>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={false} />
        </>
      )}
    </>
  );
};

export default ItemTable;
