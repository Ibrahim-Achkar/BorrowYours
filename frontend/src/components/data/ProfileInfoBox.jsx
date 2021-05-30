//package imports
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//app imports
import Message from '../utility/Message';
import Loader from '../utility/Loader';
import { updateUserProfile } from '../../store/slices/userAuth';

const ProfileInfoBox = ({ location, history }) => {
  const dispatch = useDispatch();
  const userAuth = useSelector((state) => state.features.userAuth);
  const { loading, success, error, userLogin } = userAuth;

  const [name, setName] = useState(userLogin.name);
  const [email, setEmail] = useState(userLogin.email);
  const [favouriteThing, setFavouriteThing] = useState(
    userLogin.favouriteThing
  );
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

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
    email,
    favouriteThing,
    password,
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
    } else {
      dispatch(updateUserProfile(data, headers));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>Your Profile 🌞</h2>
        {message && <Message variant='danger'>{message}</Message>}
        {error && <Message variant='danger'>{error}</Message>}
        {success && <Message variant='success'>Profile Updated!</Message>}
        {loading && <Loader />}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='name'
              placeholder='enter name'
              value={name}
              onChange={(e) => setName(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='email'>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type='email'
              placeholder='enter email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='favouriteThing'>
            <Form.Label>Favourite Thing</Form.Label>
            <Form.Control
              type='favouriteThing'
              placeholder='enter favourite thing'
              value={favouriteThing}
              onChange={(e) =>
                setFavouriteThing(e.target.value)
              }></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='Password'
              placeholder='confirm password'
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }></Form.Control>
          </Form.Group>
          <Button type='submit' variant='primary'>
            Update
          </Button>
        </Form>
      </Col>
      <Col md={9}></Col>
    </Row>
  );
};

export default ProfileInfoBox;
