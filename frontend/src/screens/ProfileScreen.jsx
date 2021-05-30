//package imports
import React from 'react';
import { Container } from 'react-bootstrap';

//app imports
import ProfileInfoBox from '../components/data/ProfileInfoBox';

const ProfileScreen = ({ location, history }) => {
  return (
    <Container>
      <ProfileInfoBox history={history} />
    </Container>
  );
};

export default ProfileScreen;
