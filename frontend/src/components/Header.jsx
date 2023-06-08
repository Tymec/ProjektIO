import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

import { logout } from '../features';
import SearchBox from './SearchBox';

function Header() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.userState);

  const logoutHandler = () => {
    dispatch(logout());
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" style={{opacity : "0.95"}} collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>PromptWorld</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <SearchBox />
            <Nav className="ml-auto">
              <LinkContainer to="/cart">
                <Nav.Link>
                  <i className="fas fa-shopping-cart"></i>Cart
                </Nav.Link>
              </LinkContainer>

              {user ? (
                <NavDropdown title={user.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>

                  <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <i className="fas fa-user"></i>Login
                  </Nav.Link>
                </LinkContainer>
              )}

              {user && user.isAdmin && (
                <LinkContainer
                  onClick={() => openInNewTab('http://localhost:8000/admin')}
                  to={window.location.pathname}>
                  <Nav.Link>
                    <i className="fas fa-user"></i>Admin
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
