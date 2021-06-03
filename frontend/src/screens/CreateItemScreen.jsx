//package imports
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import { createItem } from '../store/slices/itemsSlice';

const ProfileInfoBox = ({ location, history }) => {
  const dispatch = useDispatch();

  const userAuth = useSelector((state) => state.features.userAuth);
  const { loading, success, error, userLogin } = userAuth;

  const [name, setName] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [barcode, setBarcode] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [message, setMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!userLogin.name) {
      history.push('/login');
    }
  }, [history, userLogin]);

  //Submission of headers and data through updateUserProfile
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${userLogin.token}`,
  };

  const data = {
    id: userLogin._id,
    name,
    imageURL,
    brand,
    category,
    description,
    barcode,
    countInStock,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(createItem(data, headers));
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]; //we pass in bracket zero because we are only uploading one file
    const formData = new FormData(); //initialising a form data object (normal javascript)
    formData.append('image', file); //pass in image just like we did in the backend, and then add the file
    setUploading(true);
    try {
      //this bit is very similar to our actions
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data', //very important to sent content type for images
        },
      };
      const { data } = await axios.post('/api/upload', formData, config); //posting to upload and then getting the form data
      setImageURL(data); //setting the image to the data that comes back (which is the path)
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  return (
    <Row>
      <Col>
        <h1>Create Item 🎁</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Item Created!</Message>}
        {loading && <Loader />}
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
              placeholder='Enter image url'
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}></Form.Control>
            <Form.File
              id='image-file'
              label='Choose File'
              custom
              onChange={uploadFileHandler}></Form.File>
            {uploading && <Loader />}
          </Form.Group>
          <Form.Group controlId='favouriteThing'>
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type='brand'
              placeholder='enter brand'
              value={brand}
              onChange={(e) => setBrand(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='category'
              placeholder='enter Category'
              value={category}
              onChange={(e) => setCategory(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='description'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type='description'
              placeholder='confirm description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Create Item
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default ProfileInfoBox;
