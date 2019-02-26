import React from 'react';
import PropTypes from 'prop-types';
import {NavLink, withRouter} from 'react-router-dom';

import {AuthContext} from './AuthContext';

const LoginLink = ({ children, alwaysShow = false, location, staticContext, match, history, ...rest }) => (
  <AuthContext.Consumer>
    {({ auth, path }) => (auth.isAuthorised && !alwaysShow)
      ? null
      : (
        <NavLink to={{ pathname: path, state: { from: location } }} {...rest}>
          {children}
        </NavLink>
      )}
  </AuthContext.Consumer>
);

LoginLink.propTypes = {
  alwaysShow: PropTypes.bool,
};

export default withRouter(LoginLink);
