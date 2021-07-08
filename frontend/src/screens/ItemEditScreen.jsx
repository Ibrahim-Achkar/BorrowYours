//package imports
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import FormContainer from '../components/utility/FormContainer';
import {
  listItemDetails,
  getAllItems,
  removeItem,
  updateItem,
  getAllCategories,
  loadCategories,
} from '../store/slices/itemsSlice';

const ItemEditScreen = ({ match, history }) => {
  const dispatch = useDispatch();

  //setting up form state
  const [formName, setFormName] = useState('');
  const [formImageURL, setFormImageURL] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCountInStock, setFormCountInStock] = useState(0);
  const [formMessage, setFormMessage] = useState('');
  const [formUploading, setFormUploading] = useState(false);
  const [formUploadFile, setFormUploadFile] = useState(false);
  const [formValidated, setFormValidated] = useState(false);

  //getting current user
  const userAuth = useSelector((state) => state.features.userAuth);
  const { userLogin } = userAuth;

  //getting the current item
  const items = useSelector(getAllItems);
  const { loading: itemLoading, error: itemError, item } = items;
  const {
    countInStock,
    name,
    // imageURL,
    description,
    brand,
    category,
    barcode,
    // user,
    userId: ownerUserId,
    _id: itemId,
    // bookedDates,
  } = item;

  //getting all the categories
  const categories = useSelector(getAllCategories);

  //loading items and categories into state
  useEffect(() => {
    if (!userLogin.name) {
      history.push('/login');
    }

    dispatch(listItemDetails(match.params.id));
    dispatch(loadCategories());

    return () => {
      // componentwillunmount in functional component.
      // Anything in here is fired on component unmount.
      dispatch(removeItem());
    };
  }, [match, dispatch, userLogin.name, history]);

  //setting the form on load to the current values
  useEffect(() => {
    if (categories.length > 0) {
      setFormName(name);
      setFormBrand(brand);
      setFormCategory(category);
      setFormDescription(description);
      setFormBarcode(barcode);
      setFormCountInStock(countInStock);
    }
  }, [
    barcode,
    brand,
    categories.length,
    category,
    countInStock,
    description,
    name,
    dispatch,
  ]);

  //protecting the route
  useEffect(() => {
    if (userLogin._id && item.userId) {
      //waiting until both exist, otherwise redirect will fire too soon
      if (userLogin._id !== item.userId) {
        history.push('/');
        //if user does not own item, redirect to homepage
      }
    }
  }, [dispatch, history, item.userId, userLogin._id]);

  //Submission of headers and data through updateUserProfile
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLogin.token}`,
  };

  //helper function to get you the id of an object within an array
  function getMatchedKeyValueId(array, key, value) {
    const matchedKeyValue = array.find((item) => item[key] === value);

    if (matchedKeyValue) {
      return matchedKeyValue._id;
    }
  }

  //the data will contain the current form state
  const data = {
    itemId,
    ownerUserId,
    name: formName,
    brand: formBrand,
    category: getMatchedKeyValueId(categories, 'name', category),
    description: formDescription,
    barcode: formBarcode,
    countInStock: formCountInStock,
  };

  //File upload handler
  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setFormUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const fileURL = await axios.post('/api/v1/upload', formData, config);
      setFormUploading(false);
      return fileURL.data;
    } catch (error) {
      console.error(error);
      setFormUploading(false);
    }
  };

  //TODO Delete old image if new image uploaded
  const submitHandler = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setFormValidated(true);

    if (form.checkValidity() === true) {
      e.preventDefault();
      let path;

      if (formImageURL) {
        path = await uploadFileHandler(formUploadFile);
      }
      if (path) {
        try {
          setFormMessage('');
          dispatch(updateItem({ ...data, imageURL: path }, headers));
          history.push(`/items/${itemId}`); //TODO getting around categories breaking on update if not pushed somewhere else
        } catch (error) {
          setFormMessage(error);
        }
      } else {
        try {
          setFormMessage('');
          dispatch(updateItem(data, headers));
          history.push(`/items/${itemId}`); //as above
        } catch (error) {
          setFormMessage(error);
        }
      }
    }
  };

  const goBackHandler = () => {
    history.goBack();
  };

  return (
    <Row>
      <Col>
        <h1>Edit Item 🎁</h1>
        {formMessage && <Message variant='danger'>{formMessage}</Message>}
        {itemError && <Message variant='danger'>{itemError}</Message>}
        {itemLoading && <Loader />}
        <FormContainer>
          <Form noValidate validated={formValidated} onSubmit={submitHandler}>
            <Form.Group controlId='name'>
              <Form.Label>Item Name</Form.Label>
              <Form.Control
                required
                type='name'
                placeholder='enter name'
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
              <Form.Control.Feedback type='valid'>
                You got it 🤩
              </Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                please enter a name!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='image'>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type='text'
                placeholder='image path'
                value={formImageURL}
                onChange={(e) => setFormImageURL(e.target.value)}
              />
              <Form.Control.Feedback type='invalid'>
                please add an image!
              </Form.Control.Feedback>
              <Form.File
                id='image-file'
                label='Choose File'
                custom
                onChange={(e) => {
                  setFormImageURL(e.target.value);
                  setFormUploadFile(e.target.files[0]);
                }}></Form.File>
              {formUploading && <Loader />}
            </Form.Group>
            <Form.Group controlId='brand'>
              <Form.Label>Brand</Form.Label>
              <Form.Control
                required
                type='brand'
                placeholder='enter brand'
                value={formBrand}
                onChange={(e) => setFormBrand(e.target.value)}
              />
              <Form.Control.Feedback type='valid'>
                You got it 🤩
              </Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                please add a brand!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='category'>
              <Form.Label>Category</Form.Label>
              <Form.Control
                required
                as='select'
                type='category'
                placeholder='enter Category'
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}>
                {categories.map((category) => {
                  return <option key={category._id}>{category.name}</option>;
                })}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                type='description'
                placeholder='confirm description'
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
              />
              <Form.Control.Feedback type='valid'>
                You got it 🤩
              </Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                please add a description!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId='barcode'>
              <Form.Label>Barcode</Form.Label>
              <Form.Control
                type='barcode'
                placeholder='confirm barcode'
                value={formBarcode}
                onChange={(e) => setFormBarcode(e.target.value)}></Form.Control>
            </Form.Group>
            <Form.Group controlId='countInStock'>
              <Form.Label>Number Available</Form.Label>
              <Form.Control
                required
                type='countInStock'
                placeholder='how many of these items?'
                value={formCountInStock}
                onChange={(e) => setFormCountInStock(e.target.value)}
              />
              <Form.Control.Feedback type='valid'>
                You got it 🤩
              </Form.Control.Feedback>
              <Form.Control.Feedback type='invalid'>
                please add an amount!
              </Form.Control.Feedback>
            </Form.Group>
            <Row>
              <Col>
                <Button
                  className='btn- btn-primary my-4 p-2'
                  type='submit'
                  variant='primary'>
                  Update
                </Button>
              </Col>
              <Col>
                <Button
                  className='btn- btn-primary my-4 p-2'
                  onClick={() => {
                    goBackHandler();
                  }}>
                  Go Back
                </Button>
              </Col>
            </Row>
          </Form>
        </FormContainer>
      </Col>
    </Row>
  );
};

export default ItemEditScreen;
