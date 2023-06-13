import React, { ReactNode } from 'react';
import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, redirect, Route, Routes} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import './styles/App.css';
import './styles/All.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.js'
import { LoginHandler } from './components/LoginHandler';
import axios from 'axios';
import { GoogleSignUp } from './components/GoogleSignUp';

function App() {
  const [user, setUser] = React.useState(undefined);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);

  function changeUser(newUser: any) {
    if (newUser === undefined) {
      window.sessionStorage.removeItem('useremail')
      setUser(undefined);
      setUserLoggedIn(false);
      return;
    }
    console.log('changing user');
    setUser(newUser);
    setUserLoggedIn(true);
  }

  return (
    <GoogleOAuthProvider clientId='188196772999-80l9abu6bk3h1jbeamna9k74tbap1kl8.apps.googleusercontent.com'>
      <Router basename='/randomly'>
        <Routes>
          <Route 
            path="/" 
            element={<LoginHandler user={user} setUser={changeUser} redirect={redirect} guest={false}/>} 
            />
          <Route 
            path="/guest" 
            element={<LoginHandler user={user} setUser={changeUser} redirect={redirect} guest={true}/>} 
            />
          {/* Sign up with google route */}
          <Route
            path="/signup" 
            element={<GoogleSignUp redirect={redirect}/>}
          />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
