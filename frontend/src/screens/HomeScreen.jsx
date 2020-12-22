//package imports
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
//app imports
import SearchBox from '../components/data/SearchBox';

const HomeScreen = () => {
  return (
    <>
      <Container fluid>
        <Row className='mt-4 mb-4 d-flex align-items-center'>
          <Col className='mt-3 col-12 text-center mb-3'>
            <h1>What do you need?</h1>
          </Col>
        </Row>
        <Row className='mt-3 mb-3 d-flex'>
          <Col className='col-12'>
            <hr className='mt-4 mb-4' />
          </Col>
        </Row>
        <Row className='mt-3 mb-3 d-flex justify-content-center'>
          <Col className='mt-3 mb-3 d-flex justify-content-center'>
            <SearchBox />
          </Col>
        </Row>
        <Row className='mt-3 mb-3 d-flex'>
          <Col className='col-12'>
            <hr className='mt-4 mb-4' />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomeScreen;
