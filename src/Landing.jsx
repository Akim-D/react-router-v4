import React from 'react';
import {Link} from 'react-router-dom';

import logo from './logo.svg';

const Landing = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>Welcome to whatever this is!</p>
      <Link to="/dashboard" className="App-link">
        Open dashboard
      </Link>
    </header>
  </div>
);

export default Landing;
