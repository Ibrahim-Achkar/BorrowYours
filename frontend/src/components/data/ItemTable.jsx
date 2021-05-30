//package imports
import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

//app imports
import Message from '../utility/Message';
import Loader from '../utility/Loader';
import Paginate from '../utility/Paginate';
import Meta from '../utility/Meta';
import { loadItems, getAllItems } from '../store/slices/itemsSlice';

const ItemTable = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadItems('', pageNumber));
  }, [dispatch, pageNumber]);

  const items = useSelector(getAllItems);
  const { error, list, loading, page, pages } = items;

  return (
    <>
      <Meta title={Meta.defaultProps.title} />
      <Row className='align-items-center'>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className='text-right'>
          <Button className='my-3' onClick={() => `createProductHandler`}>
            <i className='fas fa-plus'></i> Create Product
          </Button>
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
                <th>USER</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <LinkContainer
                  key={('link to', item._id)}
                  to={`/items/${item._id}`}>
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.category}</td>
                    <td>{item.brand}</td>
                    <td>{item.user.name}</td>
                    <td>
                      <LinkContainer to={`/items/${item._id}`}>
                        <Button variant='light' className='btn-sm'>
                          <p>View Item</p>
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
