//package imports
import React, { useEffect, useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button, Row, Col, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

//app imports
import Message from '../utility/Message';
import Loader from '../utility/Loader';
import Paginate from '../utility/Paginate';
import Meta from '../utility/Meta';
import ToggleComponent from '../utility/ToggleComponent';
import {
  getItemsFromDB,
  getItemsFromState,
  getUsersItemsFromState,
  getItemEntityInfo,
  removeItem,
  updateItemAvailability,
  deleteItem,
} from '../../store/slices/itemsSlice';
import '../../styles/ItemListScreen.css';

const ItemTable = ({ history, match, name }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pageNumber = match.params.pageNumber || 1;
  const keyword = match.params.keyword || '';
  const tableName = name || 'Items';
  const userLogin = useSelector((state) => state.features.userAuth.userLogin);
  const { name: userName } = userLogin;

  const itemEntityInfo = useSelector(getItemEntityInfo);
  const [error, loading, page, pages] = itemEntityInfo;

  //TODO apparently it is really bad to use conditional useSelectors
  //but it really works here, can I do this?
  const regex = /profile/g;
  let items;

  /*this flag sets whether we ask for items marked as unavailable from the server. 
  We want to know this because item searches should not return unavailable items unless it is in the 
  user's dashboard*/
  const flags = {
    wantNotAvailable: null,
  };

  if (regex.test(location.pathname)) {
    flags.wantNotAvailable = true;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    items = useSelector(getUsersItemsFromState(userName));
  } else {
    flags.wantNotAvailable = false;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    items = useSelector(getItemsFromState);
  }

  //FUNCTIONALITY FOR TOGGLING AVAILABILITY ON/OFF
  const boolReverse = (boolStatus) => {
    if (boolStatus === true) {
      return false;
    } else {
      return true;
    }
  };

  const dispatchChange = async (item) => {
    const { isAvailable, _id: itemId, user } = item;
    const { _id: ownerUserId } = user;
    const reversedBool = boolReverse(isAvailable);

    const data = {
      ownerUserId,
      itemId,
      isAvailable: reversedBool,
    };

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userLogin.token}`,
    };
    /*TODO not a good solution because it refreshes the whole table and 
    makes unnecessary api calls Try again 😊*/
    dispatch(updateItemAvailability(data, headers, keyword, pageNumber));
  };

  //dispatching loaditems with the keyword search and pagination

  useEffect(() => {
    dispatch(removeItem());
    //TODO try to improve this:
    //removeItem() is only here to clear the state of the item so that
    //when you click on the edit button it checks that the user owns the item against the correct
    //item (otherwise it will check against any previous item that happens to be in state)
    //sending the flag so the server knows whether to return unavailable items
    dispatch(getItemsFromDB(keyword, pageNumber, flags));
    return () => {};
    // we don't want listFilter here because it will loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, keyword, pageNumber, userName]);

  //delete handler
  //implementing the bootstrap Modal
  const [showModal, setShowModal] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const deleteHandler = async (item) => {
    const { _id: itemId, user } = item;
    const { _id: ownerUserId } = user;

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userLogin.token}`,
    };

    const data = {
      ownerUserId,
      itemId,
    };

    await dispatch(deleteItem(data, headers));

    history.push(`/profile`);
  };

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
          <Table
            striped
            bordered
            hover
            responsive
            className='table-sm align-items-center'>
            <thead>
              <tr>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
                {tableName === 'Your Items' ? (
                  <>
                    <th>EDIT</th>
                    <th>Delete</th>
                    <th>Availability</th>
                  </>
                ) : (
                  <th>USER</th>
                )}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <LinkContainer to={`/items/${item._id}`}>
                    <td>{item.name}</td>
                  </LinkContainer>
                  <LinkContainer to={`/items/${item._id}`}>
                    <td>{item.description}</td>
                  </LinkContainer>
                  <LinkContainer to={`/items/${item._id}`}>
                    <td>{item.category.name}</td>
                  </LinkContainer>
                  <LinkContainer to={`/items/${item._id}`}>
                    <td>{item.brand}</td>
                  </LinkContainer>
                  {tableName === 'Your Items' ? (
                    <>
                      <td>
                        <LinkContainer to={`/items/${item._id}/edit`}>
                          <Button variant='light' className='btn-sm'>
                            <p>Edit Item</p>
                          </Button>
                        </LinkContainer>
                      </td>
                      <td>
                        <LinkContainer to={`/items/${item._id}/edit`}>
                          <>
                            <Button
                              variant='light'
                              className='btn-sm'
                              onClick={handleShowModal}>
                              <p>Delete</p>
                            </Button>
                            <Modal
                              animation={false}
                              show={showModal}
                              onHide={handleCloseModal}>
                              <Modal.Header closeButton>
                                <Modal.Title>Confirm Delete</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                Are you sure you want to delete this item?
                              </Modal.Body>
                              <Modal.Footer>
                                <Button
                                  variant='secondary'
                                  onClick={handleCloseModal}>
                                  No, take me back!
                                </Button>
                                <Button
                                  variant='primary'
                                  onClick={() => {
                                    deleteHandler(item);
                                  }}>
                                  Delete it!
                                </Button>
                              </Modal.Footer>
                            </Modal>
                          </>
                        </LinkContainer>
                      </td>
                      <td>
                        <div className='toggle_div'>
                          <ToggleComponent
                            item={item}
                            userLogin={userLogin}
                            onClick={(value) => {
                              dispatchChange(value);
                            }}
                          />
                        </div>
                      </td>
                    </>
                  ) : (
                    <td>{item.user.name}</td>
                  )}
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

export default ItemTable;
