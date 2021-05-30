//package imports
import React from 'react';
import { Container } from 'react-bootstrap';

//app imports
import './ItemListScreen.css';
import ItemTable from '../components/data/ItemTable';

const ItemListScreen = ({ history, match }) => {
  return (
    <Container>
      <ItemTable history={history} match={match} />
    </Container>
  );
};

export default ItemListScreen;
