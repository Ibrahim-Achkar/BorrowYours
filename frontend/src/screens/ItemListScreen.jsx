//package imports
import React, { useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import Paginate from '../components/utility/Paginate';
import { loadItems, getAllItems } from '../store/slices/itemsSlice';

const ItemListScreen = ({ history, match }) => {
  const pageNumber = match.params.pageNumber || 1;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadItems('', pageNumber));
  }, [dispatch, pageNumber]);

  const items = useSelector(getAllItems);
  const { error, list, loading, page, pages } = items;

  return (
    <>
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
      {/* {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>} */}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>ID</th>
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
                <tr key={item._id}>
                  <td>{item._id}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>{item.user}</td>
                  <td>
                    <LinkContainer to={`/items/${item._id}`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => `deleteHandler(product._id)`}>
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate pages={pages} page={page} isAdmin={false} />
        </>
      )}
    </>
  );
};

export default ItemListScreen;
