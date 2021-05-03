//package imports
import React from 'react';
import { Container } from 'react-bootstrap';
//app imports
import UsersList from '../components/data/UsersList';

const UsersScreen = () => {
  return (
    <>
      <Container fluid>
        <UsersList />
      </Container>
    </>
  );
};

export default UsersScreen;
