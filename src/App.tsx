import React from 'react';
import {Helmet} from 'react-helmet';
import './styles/App.css';
import './styles/All.css';
import Header from './components/header';
import Body from './components/body';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div>
     <Header></Header>
     <Body></Body>
    </div>

  );
}

export default App;
