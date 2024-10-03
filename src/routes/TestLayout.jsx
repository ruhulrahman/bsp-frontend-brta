import React, { useState } from 'react';
import { Navbar, Nav, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  // State to control sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Default show

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'hide'} scrollbar-design`}>
        <div className="sidebar-content p-3">
          <h5 className="text-white">Menu</h5>
          <ul className="list-unstyled flex flex-col space-y-8">
            <li><a href="#" className="text-white">Dashboard</a></li>
            <li><a href="#" className="text-white">Users</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">control the vertical space between</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">control the vertical space between</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Reports</a></li>
            <li><a href="#" className="text-white">Settings</a></li>
          </ul>
        </div>
      </div>

      {/* Main content area */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-open' : 'sidebar-hide'}`}>
        {/* Top Navbar */}
        <Navbar bg="dark" variant="dark" fixed="top" expand="lg" className={`${isSidebarOpen ? 'ml-[250px]' : 'ml-[0px]'}`}>
          <div className="container-fluid">
            <Button variant="outline-light" onClick={toggleSidebar}>
              {isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
            </Button>
            <Navbar.Brand href="#">Admin Panel</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto">
                <Nav.Link href="#">Dashboard</Nav.Link>
                <Nav.Link href="#">Profile</Nav.Link>
                <Nav.Link href="#">Settings</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </div>
        </Navbar>

        {/* Responsive Main Content Section */}
        <Container fluid className="pt-5 mt-5">
          <Row>
            <Col lg={8} md={6} sm={12} className="mb-4">
              {`isSidebarOpen=${isSidebarOpen}`}
              <h2>Main Content</h2>
              <p>
                This section contains the main content of the admin panel. It is responsive and adjusts based on screen size.
              </p>
            </Col>
            <Col lg={4} md={6} sm={12} className="mb-4">
              <h2>Secondary Content</h2>
              <p>
                This section contains additional content, widgets, or information. On smaller screens, it will stack below the main content.
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default App;
