import React from 'react';
import {Route, Switch} from 'react-router';

import Dashboard from './Dashboard';
import Landing from './Landing';
import withAuthentication, {AuthenticatedRoute} from './auth';

import './App.css';

const App = () => (
  <Switch>
    <Route path='/' exact component={Landing}/>
    <AuthenticatedRoute path='/dashboard' exact component={Dashboard}/>
  </Switch>
);

export default withAuthentication()(App);
