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
import {
  loadItems,
  getAllItems,
  removeItem,
} from '../../store/slices/itemsSlice';
import '../../styles/ItemListScreen.css';

const ItemTable = ({ history, match, name }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  const items = useSelector(getAllItems);
  const { error, list, loading, page, pages } = items;

  const tableName = name || 'Items';

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
    dispatch(removeItem());
    //TODO try to improve this:
    //removeItem() is only here to clear the state of the item so that
    //when you click on the edit button it checks that the user owns the item against the correct
    //item (otherwise it will check against any previous item that happens to be in state)
    dispatch(loadItems(keyword, pageNumber));
    return () => {};
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
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                {tableName === 'Your Items' ? null : <th>USER</th>}
                {tableName === 'Your Items' ? <th>EDIT</th> : null}
              </tr>
            </thead>
            <tbody>
              {reactList.map((item) => (
                <LinkContainer
                  key={('link to', item._id)}
                  to={`/items/${item._id}`}>
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.category.name}</td>
                    <td>{item.brand}</td>
                    {tableName === 'Your Items' ? null : (
                      <td>{item.user.name}</td>
                    )}
                    {tableName === 'Your Items' ? (
                      <td>
                        <LinkContainer to={`/items/${item._id}/edit`}>
                          <Button variant='light' className='btn-sm'>
                            <p>Edit Item</p>
                          </Button>
                        </LinkContainer>
                      </td>
                    ) : null}
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
