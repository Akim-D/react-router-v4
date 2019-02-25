import React from 'react';

import SiteTitle from './SiteTitle';

import logo from './logo.svg';

const Landing = () => (
  <div className="App">
    <SiteTitle>Landing — Demo</SiteTitle>
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo"/>
      <p>Welcome to whatever this is!</p>
    </header>
  </div>
);

export default Landing;
