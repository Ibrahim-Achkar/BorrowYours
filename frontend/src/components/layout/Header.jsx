import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { logout } from '../../store/slices/userAuth';
import { useDispatch, useSelector } from 'react-redux';

const Header = ({ history }) => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.features.userAuth.userLogin);
  const { name } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <header>
      <Navbar bg='light' expand='lg' collapseOnSelect>
        <Container>
          <LinkContainer to='/'>
            <Navbar.Brand>BorrowYours</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls='basic-navbar-nav' />
          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className='ml-auto'>
              <LinkContainer to='/bath'>
                <Nav.Link>
                  <i className='fa fa-bath'></i> Have a Bath
                </Nav.Link>
              </LinkContainer>
              {name ? (
                <NavDropdown title={name} id='username'>
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile 🆔</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to='/myitems'>
                    <NavDropdown.Item>My Items 🎁</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout 😭
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Nav.Link>
                    <i className='fa fa-user'></i> Log In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
