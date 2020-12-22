//package imports
import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
//app imports
// import Message from '../components/utility/Message';
// import Loader from '../components/utility/Loader';
// import { getUserDetails, updateUserProfile } from '../store/slices/userAuth';

const ProfileScreen = ({ location, history }) => {
  // const [name, setName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [message, setMessage] = useState(null);

  // const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.features.userAuth.userInfo);
  const { name, email, favouriteThing, imageURL } = userInfo;

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

  // const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  // const { success } = userUpdateProfile;

  // const orderListMy = useSelector((state) => state.orderListMy);
  // const { loading: loadingOrders, error: errorOrders, orders } = orderListMy;

  useEffect(() => {
    if (!userInfo.name) {
      history.push('/login');
    }
  }, [history, userInfo]);

  // const submitHandler = (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     setMessage('Passwords do not match'); //setMessage fills message up above (useState), then we go down to under the h1 and see that it's being used in an error.
  //   } else {
  //     dispatch(updateUserProfile({ id: user._id, name, email, password }));
  //   }
  // };

  return (
    <>
      <Row className='mt-4 mb-4'>
        <Col md={3}>
          <h1>User Profile</h1>
        </Col>
      </Row>
      <Row className='mt-4 mb-4'>
        <Col md={3}>
          <h2>Name</h2>
          <p>{name}</p>
        </Col>
        <Col md={3}>
          <h2>Email</h2>
          <p>{email}</p>
        </Col>
        <Col md={3}>
          <h2>Favourite Thing</h2>
          <p>{favouriteThing}</p>
        </Col>
      </Row>
    </>
  );
};

export default ProfileScreen;

//substring - we only want the first 10 chars in the string (the bit with the date, not the time)
