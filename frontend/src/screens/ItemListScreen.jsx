//package imports
import React from 'react';
import { Container, Row } from 'react-bootstrap';

//app imports
import ItemTable from '../components/data/ItemTable';
import SearchBox from '../components/data/SearchBox';

const ItemListScreen = ({ history, match }) => {
  return (
    <>
      <Container>
        <Row className='mt-4 mb-4 ml-0 mr-0'>
          <SearchBox history={history} list={'items'} />
        </Row>
        <ItemTable history={history} match={match} />
      </Container>
    </>
  );
};

export default ItemListScreen;
