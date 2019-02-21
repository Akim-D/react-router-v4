import React from 'react';
import {Redirect, Route} from 'react-router';

import Auth from './services/Auth';
import {AuthContext} from './AuthContext';

const withAuthentication = (
  {
    path = '/login',
    callback = `${path}/callback`,
    auth = new Auth(),
    storageKey = 'auth0',
  } = {}
) => {
  const login = ({ location: { state: { from } } }) => {
    sessionStorage.setItem(storageKey, JSON.stringify({
      pathname: from.pathname,
      search: from.search,
      hash: from.hash,
    }));

    auth.login();

    return <p>Logging in using Auth0...</p>;
  };

  class Verifier extends React.Component {
    constructor(props) {
      super(props);
      this.state = { ready: false };
    }

    render() {
      if (!this.state.ready) {
        auth.verify(() => {
          this.setState({ ready: true });
        });
        return <p>Waiting for verification...</p>;
      }

      const from = JSON.parse(sessionStorage.getItem(storageKey));
      return (
        <Redirect to={from}/>
      );
    }
  }

  return (Component) => (props) => (
    <AuthContext.Provider value={{ auth, path }}>
      <Route path={path} exact render={login}/>
      <Route path={callback} exact component={Verifier}/>
      <Component {...props}/>
    </AuthContext.Provider>
  );
};

export default withAuthentication;
