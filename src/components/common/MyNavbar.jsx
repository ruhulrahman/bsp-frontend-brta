import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faUser } from '@fortawesome/free-solid-svg-icons';

const MyNavbar = ({ username, onLogout }) => {
const { t } = useTranslation();
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#">Dashboard</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Item className="d-flex align-items-center">
              {/* <FontAwesomeIcon icon={faUser} className="me-2" /> */}
              <span>{username}</span>
            </Nav.Item>
            <Nav.Item>
              <Button variant="outline-danger" className="ms-3" onClick={onLogout}>
                Logout
              </Button>
            </Nav.Item>
          </Nav>
        </Navbar>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
