//package imports
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

//app imports
import ProfileInfoBox from '../components/data/ProfileInfoBox';
import ItemTable from '../components/data/ItemTable';

const ProfileScreen = ({ location, history, match }) => {
  return (
    <Container fluid>
      <Row>
        <Col md={4}>
          <ProfileInfoBox history={history} />
        </Col>
        <Col>
          <ItemTable history={history} match={match} name='Your Items' />
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileScreen;
