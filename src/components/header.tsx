import React from 'react';
import profileImage from '../images/profile.png';
import '../styles/Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { NavDropdown } from 'react-bootstrap';
import { googleLogout } from '@react-oauth/google';


function Header(props: {UserName: string, UserProfilePicURL: string, logout: Function}) {
  return (
    <Navbar id="rand-header-main" className='justify-content-start bg-rand-primary p-0' expand="lg">
     <Container fluid>
        <Navbar.Brand className='text-light me-5 pe-5' style={{fontFamily: 'Dancing-Script', fontSize: '30px'}}>
          Randomly
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" className='text-light'></Navbar.Toggle>
        <Navbar.Collapse className='justify-content-end'>
          <Nav className='me-auto'>
            <Nav.Link className='text-light rand-primary border-bottom border-rand-secondary-dark' style={{fontFamily: 'NotoSerifToto'}}>Everyday Words</Nav.Link>
            {/* <Nav.Link className='text-light rand-primary' style={{fontFamily: 'NotoSerifToto'}}>Techy Words</Nav.Link>
            <Nav.Link className='text-light rand-primary' style={{fontFamily: 'NotoSerifToto'}}>Foody Words</Nav.Link> */}
          </Nav>
          <Nav className='text-light'>
            <NavDropdown 
              className='text-light rand-primary rand-dropdown' 
              title={
                <div className='d-flex justify-content-between align-items-center'>
                  <div className='me-2'>{props.UserName}</div>
                  <img style={{borderRadius: '50%', width: '50px', padding: '5px'}} src={props.UserProfilePicURL} id='rand-header-profile-image'></img>
                </div>
              } 
              id="collasible-nav-dropdown" 
              menuVariant='light'
            >
              <NavDropdown.Item className='justify-content-end rand-primary' onClick={() => props.logout()}>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
