//package imports
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import {
  loadCategories,
  getAllCategories,
  getAllItems,
  createItem,
} from '../store/slices/itemsSlice';

const CreateItemScreen = ({ history }) => {
  const dispatch = useDispatch();

  const userAuth = useSelector((state) => state.features.userAuth);
  const { userLogin } = userAuth;
  const item = useSelector((state) => state.entities.items.item);

  useEffect(() => {
    if (!userLogin.name) {
      history.push('/login');
    }
    dispatch(loadCategories());
  }, [dispatch, history, userLogin]);

  useEffect(() => {
    if (item._id) {
      history.push(`/items/${item._id}`);
    }
  });

  //getting all the categories so we can map them & add the first cat to the category state
  const categories = useSelector(getAllCategories);
  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0].name);
    }
  }, [categories]);

  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setupLoadFile] = useState('');

  const items = useSelector(getAllItems);
  const {
    success: itemSuccess,
    loading: itemLoading,
    error: itemError,
  } = items;

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

  const data = {
    //does not contain imageURL because that's inserted below
    user: userLogin._id,
    name,
    brand,
    category: getMatchedKeyValueId(categories, 'name', category),
    description,
    barcode,
    countInStock,
  };

  //File upload handler
  const uploadFileHandler = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      const fileURL = await axios.post('/api/v1/upload', formData, config);
      setUploading(false);
      return fileURL.data;
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  //TODO Delete image if database entry creation fails
  const submitHandler = async (e) => {
    e.preventDefault();
    let path = await uploadFileHandler(uploadFile);
    if (path) {
      try {
        setMessage('');
        dispatch(createItem({ ...data, imageURL: path }, headers));
      } catch (error) {
        setMessage(error);
      }
    } else {
      setMessage(`File upload error`);
    }
  };

  return (
    <Row>
      <Col>
        <h1>Create Item 🎁</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {itemError && <Message variant='danger'>{itemError}</Message>}
        {itemLoading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='text'
              placeholder='image path'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}></Form.Control>
            <Form.File
              id='image-file'
              label='Choose File'
              custom
              onChange={(e) => {
                setImageURL(e.target.value);
                setupLoadFile(e.target.files[0]);
              }}></Form.File>
            {uploading && <Loader />}
          </Form.Group>
          <Form.Group controlId='brand'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='brand'
              placeholder='enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='category'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as='select'
              type='category'
              placeholder='enter Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}>
              {categories.map((category) => {
                return <option key={category._id}>{category.name}</option>;
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='description'
              placeholder='confirm description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='barcode'>
            <Form.Label>Barcode</Form.Label>
            <Form.Control
              type='barcode'
              placeholder='confirm barcode'
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='countInStock'>
            <Form.Label>Number Available</Form.Label>
            <Form.Control
              type='countInStock'
              placeholder='how many of these items?'
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Create Item
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default CreateItemScreen;
