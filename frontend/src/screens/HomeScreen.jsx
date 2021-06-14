//package imports
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
//app imports
import SearchBox from '../components/data/SearchBox';

const HomeScreen = ({ history }) => {
  return (
    <>
      <Container fluid>
        <Row className='mt-4 mb-4'>
          <Col className='mt-4 mb-4 text-center'>
            <h1>What do you need?</h1>
          </Col>
        </Row>
        <Row className='mt-4 mb-4'>
          <Col>
            <hr className='mt-4 mb-4' />
          </Col>
        </Row>
        <Row>
          <Col className='mt-4 mb-4 d-flex justify-content-center'>
            <SearchBox history={history} />
          </Col>
        </Row>
        <Row className='mt-4 mb-4'>
          <Col>
            <hr className='mt-4 mb-4' />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
