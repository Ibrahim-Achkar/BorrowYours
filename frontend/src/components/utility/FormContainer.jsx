import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

//props.children. The form we create will go in the container as a child.
const FormContainer = ({ children }) => {
  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          {children}
        </Col>
      </Row>
    </Container>
  );
};
export default FormContainer;

//This was created because we will be reusing forms with the same styles
//so easier to have it as its own component.
