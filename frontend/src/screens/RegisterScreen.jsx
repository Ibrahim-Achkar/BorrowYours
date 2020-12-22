//package imports
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//app imports
import Message from '../components/utility/Message';
import Loader from '../components/utility/Loader';
import FormContainer from '../components/utility/FormContainer';
import { register } from '../store/slices/userAuth';

const RegisterScreen = ({ location, history }) => {
  //local state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();

  const userRegister = useSelector((state) => state.features.userAuth);
  const { loading, error, userInfo } = userRegister;

  const redirect = location.search ? location.search.split('=')[1] : '/';

  useEffect(() => {
    if (userInfo.name) {
      history.push(redirect);
    }
  }, [history, userInfo, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    setMessage('');
    if (password !== confirmPassword) {
      setMessage('Make sure your passwords match! 🧨');
    } else if (name === '' || email === '') {
      setMessage('Please fill in the blanks! 📰');
    } else if (error) {
      setMessage(error);
    } else {
      dispatch(register(name, email, password));
    }
  };

  return (
    <FormContainer fluid>
      <Col className='mt-4 mb-4 col-12 text-center mb-3'>
        <h1>Sign Up!</h1>
      </Col>
      <Col className='mt-4 mb-4 col-12 text-center mb-3'>
        {(message || error) && <Message>{message}</Message>}
        {loading && <Loader />}
      </Col>
      <Form onSubmit={submitHandler}>
        <Form.Group className='mt-4 mb-4' controlId='name'>
          <Form.Label>Name</Form.Label>
          <Form.Control
            type='name'
            value={name}
            onChange={(e) => setName(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mt-4 mb-4' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mt-4 mb-4' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Form.Group className='mt-4 mb-4' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}></Form.Control>
        </Form.Group>
        <Button className='mb-4' type='submit' variant='primary'>
          Register
        </Button>
      </Form>
      <Row className='py-3'>
        <Col>
          Have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
