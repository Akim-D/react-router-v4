import React from 'react';
import PropTypes from 'prop-types';
import {NavLink} from 'react-router-dom';

import {AuthContext} from './AuthContext';

const LogoutLink = ({ children, returnUrl, alwaysShow = false, to, ...rest }) => (
  <AuthContext.Consumer>
    {({ auth, logoutPath }) => (!auth.isAuthorised && !alwaysShow)
      ? null
      : (
        <NavLink to={{ pathname: logoutPath, state: { to: returnUrl } }} {...rest}>
          {children}
        </NavLink>
      )}
  </AuthContext.Consumer>
);

LogoutLink.propTypes = {
  alwaysShow: PropTypes.bool,
};

export default LogoutLink;
