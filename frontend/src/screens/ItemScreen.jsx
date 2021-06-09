//package imports
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Image, ListGroup, Button } from 'react-bootstrap';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import Meta from '../components/utility/Meta';
import {
  listItemDetails,
  getAllItems,
  removeItem,
} from '../store/slices/itemsSlice';
import '../styles/ItemScreen.css';

const ItemScreen = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(listItemDetails(match.params.id));
  }, [match, dispatch]);

  const items = useSelector(getAllItems);
  const { loading: itemLoading, error: itemError, item } = items;
  const { countInStock, name, imageURL, description, brand, category, user } =
    item;

  /*TODO: This was all because React was not liking having objects in children & 
  page was trying to load before user and category details were loaded into state
  so the solution was to store these values in useRef().current because that persists
  for the full liketime of the component
  See if there is a better way of doing this haha*/
  const userName = useRef('');
  const categoryName = useRef('');

  useEffect(() => {
    if (category) {
      categoryName.current = category.name;
    }

    if (user) {
      userName.current = user.name;
    }
  }, [category, user]);

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
                <Button
                  className='btn- btn-primary my-4 p-2'
                  onClick={() => {
                    itemRemoveHandler();
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
                    <Col>
                      {userName ? (
                        <strong>{userName.current}</strong>
                      ) : (
                        <strong>Loading</strong>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className='item-details'>
                  <Row>
                    <Col>Category: </Col>
                    <Col>{categoryName.current}</Col>
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
                <ListGroup.Item>
                  <div className='calendar'>
                    <p>Calendar Widget Goes Here!</p>
                  </div>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Button
                    onClick={() => {
                      console.log(`addToCartHandler`);
                    }}
                    className='btn-block'
                    type='button'
                    disabled={countInStock === 0}>
                    Borrow It!
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};

export default ItemScreen;
