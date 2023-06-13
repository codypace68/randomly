import React from 'react';
import profileImage from '../images/profile.png';
import '../styles/Header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { PropaneSharp } from '@mui/icons-material';

function GuestUser(props: {redirect: Function}) {
  return (
    <div onLoad={() => {console.log('redirecting'); props.redirect('/')}} >
    </div>
  );
}

export default GuestUser;
