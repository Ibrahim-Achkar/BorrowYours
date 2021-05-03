//package imports
import React from 'react';
import { Container } from 'react-bootstrap';
//app imports
import ItemCarousel from '../components/data/ItemCarousel';

const ItemScreen = () => {
  return (
    <>
      <Container fluid>
        <ItemCarousel />
      </Container>
    </>
  );
};

export default ItemScreen;
