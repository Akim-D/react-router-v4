import React from 'react';
import {NavLink} from 'react-router-dom';
import {Route, Switch} from 'react-router';

import Dashboard from './Dashboard';
import Landing from './Landing';
import withAuthentication, {AuthenticatedRoute, LoginLink, LogoutLink} from './auth';

import './App.css';
import logo from './logo.svg';

const App = () => (
  <div className="container">
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <NavLink to="/" className="navbar-brand">
        <img src={logo} alt="Demo" height="40" width="40"/>
      </NavLink>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#react-router-v4-demo-navbar-collapse"
              aria-controls="react-router-v4-demo-navbar-collapse" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"/>
      </button>

      <div className="collapse navbar-collapse" id="react-router-v4-demo-navbar-collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item"><NavLink to="/" exact className="nav-link" activeClassName="active">Home</NavLink></li>
          <li className="nav-item"><NavLink to="/dashboard" exact className="nav-link" activeClassName="active">Dashboard</NavLink></li>
        </ul>
        <div className="navbar-nav ml-auto">
          <LoginLink className="nav-item nav-link">Login</LoginLink>
          <LogoutLink className="nav-item nav-link">Logout</LogoutLink>
        </div>
      </div>
    </nav>
    <Switch>
      <Route path='/' exact component={Landing}/>
      <AuthenticatedRoute path='/dashboard' exact component={Dashboard}/>
    </Switch>
  </div>
);

export default withAuthentication()(App);
