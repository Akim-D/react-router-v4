import React from 'react';
import PropTypes from 'prop-types';
import {Redirect, Route} from 'react-router';

import Auth from './services/Auth';
import {AuthContext} from './AuthContext';

const withAuthentication = (
  {
    path = '/login',
    callback = `${path}/callback`,
    logoutPath = '/logout',
    logoutCallbackPath = `${logoutPath}/callback`,
    auth = new Auth(),
    storageKey = 'auth0',
    onLogin = () => null,
    onVerification = () => null,
    onLogout = () => null,
    onError = () => null,
  } = {}
) => (Component) => (props) => (
  <AuthContext.Provider value={{ auth, path }}>
    <Route path={path} exact render={({ location }) => (
      <LoginHelper from={location.state.from} auth={auth} storageKey={storageKey} onLogin={onLogin}/>
    )}/>
    <Route path={callback} exact render={() => (
      <VerificationHelper auth={auth} storageKey={storageKey} onVerification={onVerification} onError={onError}/>
    )}/>
    <Route path={logoutPath} exact render={({ location }) => (
      <LogoutHelper to={location.state.to} auth={auth} storageKey={storageKey} onLogout={onLogout}/>
    )}/>
    <Component {...props}/>
  </AuthContext.Provider>
);

class LoginHelper extends React.PureComponent {
  componentDidMount() {
    const { from, auth, storageKey } = this.props;

    sessionStorage.setItem(storageKey, JSON.stringify({
      pathname: from.pathname,
      search: from.search,
      hash: from.hash,
    }));

    auth.login();
  }

  render() {
    return this.props.onLogin();
  }
}

class VerificationHelper extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { ready: false, error: null };
  }

  componentDidMount() {
    const { auth } = this.props;

    auth.verify().then(() => {
      this.setState({ ready: true });
    }).catch((error) => {
      this.setState({ ready: true, error });
    });
  }

  render() {
    if (!this.state.ready) {
      return this.props.onVerification();
    } else if (this.state.error) {
      return this.props.onError(this.state.error);
    }

    const { storageKey } = this.props;
    const from = JSON.parse(sessionStorage.getItem(storageKey));
    return <Redirect to={from}/>;
  }
}

class LogoutHelper extends React.PureComponent {
  componentDidMount() {
    const { to, auth, storageKey } = this.props;

    sessionStorage.setItem(`${storageKey}:logout`, JSON.stringify({
      path: to
    }));

    auth.logout();
  }

  render() {
    return this.props.onLogout();
  }
}

LogoutHelper.propTypes = {
  auth: PropTypes.instanceOf(Auth).isRequired,
  to: PropTypes.string.isRequired,
  storageKey: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default withAuthentication;
