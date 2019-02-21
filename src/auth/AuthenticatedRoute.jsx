import React from 'react';
import PropTypes from 'prop-types';
import {Route, Redirect} from 'react-router';

import {AuthContext} from './AuthContext';

const AuthenticatedRoute = ({ component: Component, ...rest }) => (
  <AuthContext.Consumer>
    {({ auth, path }) => (
      <Route {...rest} render={
        (props) => auth.isAuthorised ? (
          <Component {...props}/>
        ) : (
          <Redirect to={{
            pathname: path,
            state: { from: props.location }
          }}/>
        )
      }/>
    )}
  </AuthContext.Consumer>
);

AuthenticatedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func.isRequired, PropTypes.instanceOf(React.Component).isRequired]),
  path: PropTypes.string.isRequired,
};

export default AuthenticatedRoute;
