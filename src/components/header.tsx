import React from 'react';
import profileImage from '../images/profile.png';
import '../styles/Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function Header() {
  return (
    <Navbar id="rand-header-main" className='justify-content-start bg-rand-primary p-0' expand="lg">
     <Container fluid>
        <Navbar.Brand className='text-light me-5 pe-5'>
          Randomly
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='text-light'></Navbar.Toggle>
        <Navbar.Collapse className='justify-content-end'>
          <Nav className='me-auto'>
            <Nav.Link className='text-light rand-primary'>Everyday Words</Nav.Link>
            <Nav.Link className='text-light rand-primary'>Techy Words</Nav.Link>
            <Nav.Link className='text-light rand-primary'>Foody Words</Nav.Link>
          </Nav>
          <Nav className='text-light'>
            <Nav.Link className='justify-content-end text-light rand-primary'>
              John Doe 
              <img src={profileImage} id='rand-header-profile-image'></img>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
