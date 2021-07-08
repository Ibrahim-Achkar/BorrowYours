//package imports
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Container, Row, Col } from 'react-bootstrap';

//app imports
import ProfileInfoBox from '../components/data/ProfileInfoBox';
import ItemTable from '../components/data/ItemTable';
import { resetUserAuthFlags } from '../store/slices/userAuth';

const ProfileScreen = ({ history, match }) => {
  //TODO pull up bits of state that are being called by both profile info box and item table

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(resetUserAuthFlags());
    };
  }, [dispatch, history]);

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
