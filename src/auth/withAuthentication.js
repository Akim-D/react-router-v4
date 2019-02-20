import React from 'react';
import {Route} from 'react-router';

import Auth from './services/Auth';
import {AuthContext} from './AuthContext';

const withAuthentication = ({ path = '/login', callback = `${path}/callback`, auth = new Auth() } = {}) => {
  return (Component) => (props) => (
    <AuthContext.Provider value={{ auth, path }}>
      <Route path={path} exact render={login}/>
      <Route path={callback} exact render={verify}/>
      <Component {...props}/>
    </AuthContext.Provider>
  );

  function login() {
    auth.login();
    return null;
  }

  function verify() {
    auth.verify();
    return null;
  }
};

export default withAuthentication;
