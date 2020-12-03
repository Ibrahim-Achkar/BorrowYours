import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const Header = () => {
  return (
    <header>
      <Navbar bg='light' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>Template MERN</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              <LinkContainer to='/bath'>
                <Nav.Link>
                  <i className='fa fa-bath'></i> Have a Bath
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to='/login'>
                <Nav.Link>
                  <i className='fa fa-user'></i> Log In
                </Nav.Link>
              </LinkContainer>
              <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
                <LinkContainer to='/hello'>
                  <NavDropdown.Item>Hello</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/goodbye'>
                  <NavDropdown.Item>GoodBye</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to='/again'>
                  <NavDropdown.Item>Again?</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
