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
  loadCategories,
  getAllCategories,
  getItemsFromState,
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
      setFormCategory(categories[0].name);
    }
  }, [categories]);

  const [formName, setFormName] = useState('');
  const [formImageURL, setFormImageURL] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formBarcode, setFormBarcode] = useState('');
  const [formCountInStock, setFormCountInStock] = useState('');
  const [formMessage, setFormMessage] = useState(null);
  const [formUploading, setFormUploading] = useState(false);
  const [formUploadFile, setFormUploadFile] = useState('');
  const [formValidated, setFormValidated] = useState(false);

  const items = useSelector(getItemsFromState);
  const { loading: itemLoading, error: itemError } = items;

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
    name: formName,
    brand: formBrand,
    category: getMatchedKeyValueId(categories, 'name', formCategory),
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

  //TODO Delete image if database entry creation fails
  const submitHandler = async (e) => {
    const form = e.currentTarget;

    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }

    setFormValidated(true);

    if (form.checkValidity() === true) {
      e.preventDefault();
      let path = await uploadFileHandler(formUploadFile);
      if (path) {
        try {
          setFormMessage('');
          dispatch(createItem({ ...data, imageURL: path }, headers));
        } catch (error) {
          setFormMessage(error);
        }
      } else {
        setFormMessage(`File upload error`);
      }
    }
  };

  return (
    <Row>
      <Col>
        <h1>Create Item 🎁</h1>
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
                required
                type='text'
                placeholder='image path'
                value={formImageURL}
                onChange={(e) => setFormImageURL(e.target.value)}
              />
              <Form.Control.Feedback type='valid'>
                You got it 🤩
              </Form.Control.Feedback>
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
            <Button type='submit' variant='primary'>
              Create Item
            </Button>
          </Form>
        </FormContainer>
      </Col>
    </Row>
  );
};

export default CreateItemScreen;
