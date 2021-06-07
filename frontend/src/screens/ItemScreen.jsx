//package imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Button, Form } from 'react-bootstrap';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import Meta from '../components/utility/Meta';
import {
  listItemDetails,
  getAllItems,
  removeItem,
} from '../store/slices/itemsSlice';

const ItemScreen = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(listItemDetails(match.params.id));
  }, [match, dispatch]);

  const items = useSelector(getAllItems);
  const { loading: itemLoading, error: itemError, item } = items;

  const itemRemoveHandler = () => {
    dispatch(removeItem());
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
          <Meta title={item.name} />
          <Row>
            <Col md={6}>
              <Image src={item.imageURL} alt={item.name} fluid />
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h3>{item.name}</h3>
                </ListGroup.Item>
                <ListGroup.Item>Description: {item.description}</ListGroup.Item>
              </ListGroup>
            </Col>
            <Col md={3}>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <Row>
                    <Col>Owned by: </Col>
                    <Col>
                      <strong>{item.user}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Status: </Col>
                    <Col>
                      <strong>
                        {item.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                      </strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {item.countInStock > 0 && (
                  <ListGroup.Item>
                    <Row>
                      <Col>Qty</Col>
                      <Col>
                        <Form.Control
                          as='select'
                          value={qty}
                          onChange={(e) => setQty(e.target.value)}>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                )}
                <ListGroup.Item>
                  <Button
                    onClick={() => {
                      console.log(`addToCartHandler`);
                    }}
                    className='btn-block'
                    type='button'
                    disabled={item.countInStock === 0}>
                    Add to Cart
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
      <Button
        className='btn- btn-primary my-4 p-2'
        onClick={() => {
          itemRemoveHandler();
        }}>
        Go Back
      </Button>
    </>
  );
};

export default ItemScreen;
